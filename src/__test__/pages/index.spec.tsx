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