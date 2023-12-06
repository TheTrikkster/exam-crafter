import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Drafting from "../../app/drafting/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation");

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Drafting Component", () => {
  const testCases = [
    {
      response: "INVALID",
      expectedText:
        "Ce que vous avez fourni n'est pas une leçon, vous ne pouvez donc pas créer un examen",
    },
    {
      response: "Le contenu fourni est trop court",
      expectedText: "Le contenu fourni est trop court",
    },
    {
      response: "Le contenu fourni est trop volumineux",
      expectedText: "Le contenu fourni est trop volumineux",
    },
    {
      response: "Erreur lors de la conversion du PDF en texte.",
      expectedText: "Erreur lors de la génération de l'examen",
    },
    {
      response: "Erreur lors de la génération de la réponse.",
      expectedText: "Erreur lors de la génération de l'examen",
    },
  ];

  const fillTextAreaWithA = () => {
    render(<Drafting />);

    const textarea = screen.getByPlaceholderText(
      /Ecrivez votre texte ici.../,
    ) as HTMLTextAreaElement;
    for (let i = 0; i <= 30; i++) {
      fireEvent.change(textarea, { target: { value: textarea.value + "a" } });
    }

    fireEvent.click(screen.getByRole("button", { name: /Créer Exam/i }));
  };

  const requeteResponse = (text: string) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        message: {
          message: {
            role: "assistant",
            content: text,
          },
        },
      }),
    });
  };

  it("renders without crashing", () => {
    render(<Drafting />);
    expect(
      screen.getByRole("button", { name: /Créer Exam/i }),
    ).toBeInTheDocument();
  });

  it("redirects user upon successful exam creation with a PDF", async () => {
    requeteResponse("text");

    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Drafting />);

    const selectElement = screen.getByLabelText(/Choisissez une option:/i);
    fireEvent.change(selectElement, { target: { value: "pdf" } });

    await waitFor(() => {
      expect(selectElement).toHaveValue("pdf");
    });

    const fileInput = screen.getByTestId("file-upload");
    const fakeFile = new File(["(⌐□_□)"], "example.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(fileInput, "files", {
      value: [fakeFile],
      writable: false,
    });
    fireEvent.change(fileInput);

    fireEvent.click(screen.getByRole("button", { name: /Créer Exam/i }));

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith("/question/1");
      },
      { timeout: 1000 },
    );
  });

  it("redirects user again upon text fild after add pdf", async () => {
    requeteResponse("text");

    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Drafting />);

    const selectElement = screen.getByLabelText(/Choisissez une option:/i);
    fireEvent.change(selectElement, { target: { value: "pdf" } });

    await waitFor(() => {
      expect(selectElement).toHaveValue("pdf");
    });

    const fileInput = screen.getByTestId("file-upload");
    const fakeFile = new File(["(⌐□_□)"], "example.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(fileInput, "files", {
      value: [fakeFile],
      writable: false,
    });
    fireEvent.change(fileInput);

    fireEvent.change(selectElement, { target: { value: "text" } });

    expect(
      screen.getByRole("button", { name: /Confirmer/i }),
    ).toBeInTheDocument();
  });

  it("redirects user upon successful exam creation", async () => {
    requeteResponse("text");

    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    fillTextAreaWithA();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/question/1");
    });
  });

  testCases.forEach((testCase) => {
    it(`shows error when the lesson response is "${testCase.response}"`, async () => {
      requeteResponse(testCase.response);
      fillTextAreaWithA();
      await waitFor(() => {
        expect(screen.getByText(testCase.expectedText)).toBeInTheDocument();
      });
    });
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn(() => Promise.reject("API call failed"));
    console.error = jest.fn();

    fillTextAreaWithA();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Quelque chose s'est mal passé",
      );
    });
  });
});
