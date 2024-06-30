// import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// import Question from "../../app/question/[id]/page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    query: { id: "1" },
  }),
}));

// describe("QuestionPage Component", () => {
//   beforeEach(() => {
//     window.localStorage.setItem(
//       "questions",
//       JSON.stringify(["Simple Question 1", "Simple Question 2"]),
//     );
//   });

//   it("renders correctly for a valid question id", async () => {
//     render(<Question params={{ id: "1" }} />);

//     const questionElement = screen.getByText(/Simple Question 1/);
//     expect(questionElement).toBeInTheDocument();

//     const textAreaElement = screen.getByPlaceholderText(
//       /Vous devez écrire votre réponse ici/,
//     ) as HTMLTextAreaElement;
//     expect(textAreaElement).toBeInTheDocument();

//     const buttonElement = screen.getByText(/prochaine question/);
//     expect(buttonElement).toBeDisabled();

//     fireEvent.change(textAreaElement, { target: { value: "Simple answer" } });
//     fireEvent.click(buttonElement);

//     expect(buttonElement).not.toBeDisabled();
//   });

//   it("shows 404 for an invalid question id", () => {
//     render(<Question params={{ id: "5" }} />);
//     expect(screen.getByText(/Cette page n'existe pas/)).toBeInTheDocument();
//   });

//   it("change page", async () => {
//     window.localStorage.setItem("responses", JSON.stringify({}));

//     render(<Question params={{ id: "1" }} />);

//     const textAreaElement = screen.getByPlaceholderText(
//       /Vous devez écrire votre réponse ici/,
//     ) as HTMLTextAreaElement;
//     const buttonElement = screen.getByText(/prochaine question/);

//     fireEvent.change(textAreaElement, { target: { value: "Simple answer" } });
//     fireEvent.click(buttonElement);

//     await waitFor(() => {
//       expect(mockPush).toHaveBeenCalledWith("/question/2");
//     });
//   });

//   it("loading of result page", async () => {
//     global.fetch = jest.fn((url) => {
//       if (url === "/api/correct_exam") {
//         return Promise.resolve({
//           ok: true,
//           json: () =>
//             Promise.resolve({
//               ids: ["1", "12"],
//             }),
//         }) as Promise<Response>;
//       } else if (url === "/api/check") {
//         for (let i = 0; i < 11; i++) {
//           if (i === 10) {
//             return Promise.resolve({
//               ok: true,
//               json: () =>
//                 Promise.resolve({
//                   status: "ready",
//                   data: { comment: "hello" },
//                 }),
//             }) as Promise<Response>;
//           } else {
//             return Promise.resolve({
//               ok: true,
//               json: () =>
//                 Promise.resolve({
//                   status: "ready",
//                   data: { text: "hello", grade: "1" },
//                 }),
//             }) as Promise<Response>;
//           }
//         }
//       }
//       return Promise.resolve(new Response()) as Promise<Response>;
//     });

//     render(<Question params={{ id: "2" }} />);

//     const textAreaElement = screen.getByPlaceholderText(
//       /Vous devez écrire votre réponse ici/,
//     ) as HTMLTextAreaElement;
//     const buttonElement = screen.getByText(/prochaine question/);

//     fireEvent.change(textAreaElement, { target: { value: "Simple answer" } });
//     fireEvent.click(buttonElement);

//     await waitFor(() => {
//       expect(screen.getByText("correction")).toBeInTheDocument();
//     });
//     await waitFor(() => {
//       expect(mockPush).toHaveBeenCalledWith("/result");
//     });
//   });
// });
