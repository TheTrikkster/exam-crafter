import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Home from "../../app/page";
import { useRouter } from 'next/navigation';


jest.mock('next/navigation');

afterEach(() => {
    jest.clearAllMocks();
});

describe("Home Component", () => {

    const fillTextAreaWithA = () => {
        render(<Home />);

        const textarea = screen.getByPlaceholderText('Ecrivez ici votre texte...')as HTMLTextAreaElement;
        for (let i = 0; i <= 51; i++) {
            fireEvent.change(textarea, { target: { value: textarea.value + 'a' } });
        }

        fireEvent.click(screen.getByText('Créer Exam'));
    };

    const requeteResponse = (text: string) => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({message: {
                message: {
                    role: 'assistant',
                    content: text
                  }
              }}),
          });
    }

    it("renders without crashing", () => {
      render(<Home />);
      expect(screen.getByText("Créer Exam")).toBeInTheDocument();
      expect(screen.getByText("Choisir PDF")).toBeInTheDocument();
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

    it("shows error when the lesson isn't valid", async () => {

        requeteResponse("Ce que vous avez fourni n'est pas une leçon, donc je ne peux pas vous donner d'examen.");
      
        fillTextAreaWithA();
      
        await waitFor(() => {
          expect(screen.getByText("Ce que vous avez fourni n'est pas une leçon, donc je ne peux pas vous donner d'examen.")).toBeInTheDocument();
        });
    });

    it("handles fetch errors gracefully", async () => {
        global.fetch = jest.fn(() => Promise.reject("API call failed"));
        console.error = jest.fn();
      
        fillTextAreaWithA();
      
        await waitFor(() => {
          expect(console.error).toHaveBeenCalledWith("Quelque chose s'est mal passé");
        });
    });
});













// 'Question 1: Quelle est la définition du théorème de Pythagore ?\n' +
// 'endOfQuestion\n' +
// 'Question 2: Quelles sont les deux autres catégories auxquelles Pythagore est associé ?\n' +
// 'endOfQuestion\n' +
// 'Question 3: Que représente la lettre "c" dans le théorème de Pythagore ?\n' +
// 'endOfQuestion\n' +
// "Question 4: Expliquez avec vos propres mots comment utiliser le théorème de Pythagore pour trouver la longueur de l'hypoténuse d'un triangle rectangle.\n" +
// 'endOfQuestion\n' +
// "Question 5: Pouvez-vous donner un exemple d'application du théorème de Pythagore ?\n" +
// 'endOfQuestion\n' +
// "Question 6: Combien mesure l'hypoténuse d'un triangle rectangle dont les côtés mesurent 6 unités et 8 unités ?\n" +
// 'endOfQuestion\n' +
// 'Question 7: Pouvez-vous donner une preuve du théorème de Pythagore ?\n' +
// 'endOfQuestion\n' +
// 'Question 8: Quels sont les trois éléments nécessaires pour appliquer le théorème de Pythagore ?\n' +
// 'endOfQuestion\n' +
// "Question 9: Quelle est l'utilité du théorème de Pythagore dans la géométrie euclidienne ?\n" +
// 'endOfQuestion\n' +
// 'Question 10: Est-ce que le théorème de Pythagore a été découvert par Pythagore lui-même ?\n' +
// 'endOfQuestion'