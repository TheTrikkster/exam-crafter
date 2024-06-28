// import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// import Result from "../../app/result/page";

// describe("Analyse data", () => {
//   beforeEach(() => {
//     window.localStorage.setItem(
//       "questions",
//       JSON.stringify([
//         "Simple Question 1",
//         "Simple Question 2",
//         "Simple Question 3",
//         "Simple Question 4",
//         "Simple Question 5",
//         "Simple Question 6",
//         "Simple Question 7",
//         "Simple Question 8",
//         "Simple Question 9",
//         "Simple Question 10",
//       ]),
//     );
//     window.localStorage.setItem(
//       "responses",
//       JSON.stringify({
//         1: "Simple Response 1",
//         2: "Simple Response 2",
//         3: "Simple Response 3",
//         4: "Simple Response 4",
//         5: "Simple Response 5",
//         6: "Simple Response 6",
//         7: "Simple Response 7",
//         8: "Simple Response 8",
//         9: "Simple Response 9",
//         10: "Simple Response 10",
//       }),
//     );
//     window.localStorage.setItem(
//       "corrections",
//       JSON.stringify([
//         { correction: "Simple Correction 1", grade: 1 },
//         { correction: "Simple Correction 2", grade: 1 },
//         { correction: "Simple Correction 3", grade: 1 },
//         { correction: "Simple Correction 4", grade: 1 },
//         { correction: "Simple Correction 5", grade: 1 },
//         { correction: "Simple Correction 6", grade: 1 },
//         { correction: "Simple Correction 7", grade: 1 },
//         { correction: "Simple Correction 8", grade: 1 },
//         { correction: "Simple Correction 9", grade: 1 },
//         { correction: "Simple Correction 10", grade: 1 },
//       ]),
//     );
//   });

//   it("Check data", async () => {
//     render(<Result />);

//     expect(screen.getByText("Simple Question 1")).toBeInTheDocument();
//     expect(screen.getByText("onse 1")).toBeInTheDocument();
//     expect(screen.getByText("Simple Correction 1")).toBeInTheDocument();
//     expect(screen.getByText("Note: 10/10")).toBeInTheDocument();
//   });

//   it("Without questions", async () => {
//     window.localStorage.setItem("questions", JSON.stringify([]));
//     render(<Result />);

//     expect(screen.getByText("Vous n'avez pas accès")).toBeInTheDocument();
//   });

//   it("The exam has not been completed", async () => {
//     window.localStorage.setItem("corrections", JSON.stringify([]));
//     render(<Result />);

//     expect(screen.getByText("Vous n'avez pas accès")).toBeInTheDocument();
//   });
// });
