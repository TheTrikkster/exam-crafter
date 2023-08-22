import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Question from "../../app/question/[id]/page";
// import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    query: { id: "1" }
  }),
}));

// afterEach(() => {
//     jest.clearAllMocks();
// });

describe('QuestionPage Component', () => {
    beforeEach(() => {
        window.localStorage.setItem('questions', JSON.stringify(["Sample Question 1", "Sample Question 2"]));
    });

    it('renders correctly for a valid question id', async () => {
        render(<Question params={{id: "1"}} />);
        
        const questionElement = screen.getByText(/Sample Question 1/);
        expect(questionElement).toBeInTheDocument();
    
        const textAreaElement = screen.getByPlaceholderText(/Vous devez écrire votre ici/)as HTMLTextAreaElement;
        expect(textAreaElement).toBeInTheDocument();
    
        const buttonElement = screen.getByText(/prochaine question/);
        expect(buttonElement).toBeDisabled();
    
        fireEvent.change(textAreaElement, { target: { value: 'Sample answer' } });
        fireEvent.click(buttonElement);
    
        expect(buttonElement).not.toBeDisabled();
    });
  
    it('shows 404 for an invalid question id', () => {
        render(<Question params={{id: "5"}} />);
        const notFoundElement = screen.getByText(/404 page not found/);
        expect(notFoundElement).toBeInTheDocument();
    });

    it("change page", async () => {
        render(<Question params={{id: "1"}} />);

        const textAreaElement = screen.getByPlaceholderText(/Vous devez écrire votre ici/)as HTMLTextAreaElement;
        const buttonElement = screen.getByText(/prochaine question/);

        fireEvent.change(textAreaElement, { target: { value: 'Sample answer' } });
        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/question/2');
        })
    })

    it("loading of result page", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({message: {
                message: {
                    role: 'assistant',
                    content: `
                        'Question 1: Quelle est la définition du théorème de Pythagore ?\n' +
                        "Correction 1: Le théorème de Pythagore affirme que dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.\n" +
                        'endAndStartOfQuestion\n' +
                        '\n' +
                        'Question 2: Quels sont les éléments nécessaires pour appliquer le théorème de Pythagore dans un triangle rectangle ?\n' +
                        'Correction 2: Pour appliquer le théorème de Pythagore dans un triangle rectangle, il faut connaître les longueurs des deux côtés perpendiculaires (catétés).\n' +
                        'endAndStartOfQuestion\n' +
                        '\n' +
                        'startOfComment\n' +
                        'Overall, you have demonstrated good understanding of the Pythagorean theorem and its applications. Your answers are mostly correct and provide the necessary explanations. However, please be careful with the spelling and grammar mistakes in your responses. It is important to present your answers clearly and accurately. Keep up the good work!\n' +
                        'endOfComment\n' +
                        '\n' +
                        'gradeOfExam'
                    `
                  }
              }}),
          });
    
        render(<Question params={{id: "2"}} />);
    
        const textAreaElement = screen.getByPlaceholderText(/Vous devez écrire votre ici/) as HTMLTextAreaElement;
        const buttonElement = screen.getByText(/prochaine question/);
    
        fireEvent.change(textAreaElement, { target: { value: 'Sample answer' } });
        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(screen.getByText("correction en cours...")).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/result');
        })
    })
  });