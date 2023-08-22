import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Result from "../../app/result/page";


describe("Analyse data", () => {
    beforeEach(() => {
        window.localStorage.setItem('questions', JSON.stringify(["Sample Question 1", "Sample Question 2"]));
        window.localStorage.setItem('responses', JSON.stringify({1:"Sample Response 1", 2: "Sample Response 2"}));
        window.localStorage.setItem('corrections', JSON.stringify(["Sample Correction 1", "Sample Correction 2"]));
        window.localStorage.setItem('comment', JSON.stringify("Sample Comment"));
        window.localStorage.setItem('grade', JSON.stringify("Sample Grade"));
    })
    
    it("Check data", async () => {
        render(<Result />)

        expect(screen.getByText("Sample Question 1")).toBeInTheDocument();
        expect(screen.getByText("nse 1")).toBeInTheDocument();
        expect(screen.getByText("Sample Correction 1")).toBeInTheDocument();
        expect(screen.getByText("Sample Comment")).toBeInTheDocument();
        expect(screen.getByText("Sample Grade")).toBeInTheDocument();
    })

    it("Without questions", async () => {
        window.localStorage.setItem('questions', JSON.stringify([]));
        render(<Result />)

        expect(screen.getByText("Vous devez d'abord créer l'examen")).toBeInTheDocument();
    })

    it("The exam has not been completed", async () => {
        window.localStorage.setItem('corrections', JSON.stringify([]));
        render(<Result />)

        expect(screen.getByText("Vous devez finir l'examen")).toBeInTheDocument();
    })
})