import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useAppContext } from "@/app/context";
import Drafting from "@/app/drafting/page";
import fetchMock from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";

jest.mock("../../app/context", () => ({
  useAppContext: jest.fn(),
}));

const mockContextValue = {
  selectedOptions: {},
  setSelectedOptions: jest.fn(),
  setGeneratedQuestions: jest.fn(),
  setNumberOfChange: jest.fn(),
  setCanChangeAllQuestions: jest.fn(),
  request: jest.fn().mockResolvedValue([]),
};

(useAppContext as jest.Mock).mockReturnValue(mockContextValue);

beforeEach(() => {
  fetchMock.resetMocks();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const fetchClasseResponse = [
  {
    name: "Seconde",
    bound_to: ["Classe"],
  },
  {
    name: "Première",
    bound_to: ["Classe"],
  },
  {
    name: "Terminale",
    bound_to: ["Classe"],
  },
];

const fetchFiliereResponse = [
  {
    name: "Professionnelle",
    bound_to: ["Seconde"],
  },
  {
    name: "Générale et Technologies",
    bound_to: ["Seconde"],
  },
];

// const fetchMatiereResponse = [
//   {
//     name: "Français",
//     bound_to: ["Professionnelle"],
//   },
//   {
//     name: "Mathématiques",
//     bound_to: ["Professionnelle"],
//   },
// ];

// const confirmeOption = async (
//   text: string,
//   fetch: { name: string; bound_to: string[] }[],
//   fetchResponse?: string,
// ) => {
//   userEvent.click(screen.getByText(text));

//   fetchMock.mockResponseOnce(JSON.stringify(fetch));

//   const continuerButton = await screen.findByText("Continuer", {
//     selector: "button:not(.hidden)",
//   });

//   userEvent.click(continuerButton);

//   if (fetchResponse) {
//     await waitFor(() => {
//       expect(screen.getByText(fetchResponse)).toBeInTheDocument();
//     });
//   }
// };

describe("DraftingFunctions Component", () => {
  it('renders "Seconde" in options', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fetchClasseResponse));

    render(<Drafting />);

    await waitFor(() => {
      expect(screen.getByText("Seconde")).toBeInTheDocument();
    });
  });

  it('renders "Seconde" in options', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fetchClasseResponse));

    render(<Drafting />);

    await waitFor(() => {
      expect(screen.getByText("Seconde")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Seconde"));

    fetchMock.mockResponseOnce(JSON.stringify(fetchFiliereResponse));

    userEvent.click(screen.getByText("Continuer"));

    await waitFor(() => {
      expect(screen.getByText("Professionnelle")).toBeInTheDocument();
    });
  });

  // it('renders "Seconde" in options', async () => {
  //   fetchMock.mockResponseOnce(JSON.stringify(fetchClasseResponse));

  //   render(<Drafting />);

  //   await waitFor(() => {
  //     screen.getByText("Seconde");
  //   });

  //   await confirmeOption("Seconde", fetchFiliereResponse, "Professionnelle");

  //   await confirmeOption("Professionnelle", fetchMatiereResponse, "Français");

  //   userEvent.click(screen.getByText("Français"));

  //   const continuerMatiereButton = await screen.findByText("Continuer", {
  //     selector: "button:not(.hidden)",
  //   });

  //   userEvent.click(continuerMatiereButton);

  //   await waitFor(() => {
  //     expect(
  //       screen.getByPlaceholderText("exemple: Première Guerre Mondiale"),
  //     ).toBeInTheDocument();
  //   });

  //   const input = screen.getByPlaceholderText(
  //     "exemple: Première Guerre Mondiale",
  //   );

  //   userEvent.type(input, "Première Guerre Mondiale");

  //   const continuerChapitreButton = await screen.findByText("Continuer", {
  //     selector: "button:not(.hidden)",
  //   });

  //   userEvent.click(continuerChapitreButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("15")).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Créer Examen")).toBeInTheDocument();
  //   });
  // });

  it('renders "Seconde" in options', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fetchClasseResponse));

    render(<Drafting />);

    const continuerChapitreButton = await screen.findByText("Continuer", {
      selector: "button:not(.hidden)",
    });

    await waitFor(() => {
      expect(continuerChapitreButton).toBeDisabled();
    });
  });
});
