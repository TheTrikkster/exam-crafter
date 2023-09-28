"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { QuestionType } from './[id]/page';

export const QuestionFunctions = ({params}: QuestionType) => {
  const id = Number(params.id);
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [reponseError, setReponseError] = useState<{toLong: boolean, generation: boolean}>({toLong: false, generation: false});
  const [correction, setCorrection] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const questions = JSON.parse(window.localStorage.getItem("questions") || '[]');
  const allResponses = JSON.parse(window.localStorage.getItem("responses") || '{}');
  let generationError = false;

  const sendResponse = () => {
      allResponses[id] = `Response ${id}: ${response}`;
      window.localStorage.setItem("responses", JSON.stringify(allResponses));
  }

  const request = async (question: string, index: number, choosedPrompt: string) => {
    try{
      const waitResponse = await fetch("/api/correct_exam", {
        method: "POST",
        body: choosedPrompt == "comment" ? JSON.stringify({data: [...questions, ...Object.values(allResponses)], choosedPrompt: "comment"}) : JSON.stringify({data: [question, allResponses[index+1]], choosedPrompt: choosedPrompt})
      });

      if (!waitResponse.ok) {
        throw new Error("Erreur dans la réponse");
      }

      const data = await waitResponse.json();

      if(data.message.message.content == "Erreur lors de la génération de la réponse.") {
        generationError = true;
      }


      return data.message.message.content
    } catch(err) {
      console.error(err);
    }
  }

  const fetchData = async () => {
    const allCorrections = await Promise.all(questions.map(async (question: string, index: number) => {
      try {
        const correction = await request(question, index, "response")
        const grade = await request(question, index, "grade")

        return {correction: correction, grade: grade}
      } catch (error) {
        console.error(error)
      }
    }))

    const comment = await request("", 0, "comment")
    
    if(generationError) {
      setCorrection(false);
      delete allResponses[10];
      window.localStorage.setItem("responses", JSON.stringify(allResponses));
      setReponseError(prevState => ({...prevState, generation: true}));
    } else {
      window.localStorage.setItem("comment", JSON.stringify(comment.trim()));
      window.localStorage.setItem("corrections", JSON.stringify(allCorrections));
      router.push(`/result`);
    }
  }

  const confirmOptionChange = () => {
    setShowModal(false);
    window.localStorage.setItem("questions", JSON.stringify([]));
    window.localStorage.setItem("responses", JSON.stringify({}));
    window.localStorage.setItem("comment", JSON.stringify(""));
    window.localStorage.setItem("corrections", JSON.stringify([]));
    router.push(`/drafting`);
  };

  const cancelOptionChange = () => {
    setShowModal(false);
  };

  const handleAnswer = (nextQuestionId: number) => {
      router.push(`/question/${nextQuestionId}`);
  };

  if (id < 1 || id > questions.length) {
    return (
      <div className='question_loading_or_do_not_exist'>
        <p className='question_loading_text_or_do_not_exist'>Cette page n&#39;existe pas</p>
      </div>
    )
  }

  if (correction) {
    return (
      <div className='question_loading_or_do_not_exist'>
        <SyncLoader color="#34495E" size={18} />
        <p className='question_loading_text_or_do_not_exist'>correction</p>
      </div>
    ) 
  }

  if (Object.keys(allResponses).length !== id-1) {
    return (
      <div className='question_loading_or_do_not_exist'>
        <p className='question_loading_text_or_do_not_exist'>Cette page n&#39;est pas disponible</p>
      </div>
    )
  }

  return (
    <>
        <header>
          {questions.length > 0 ? <h3 className='question_the_question'>{questions[id - 1]}</h3> : null}
        </header>
        {showModal && (
            <div className="drafting_modal">
                <div className="drafting_modal_content">
                    <p>Êtes-vous sûr de vouloir quitter ? <br /> Cela supprimera l&#39;examen.</p>
                    <div className="drafting_modal_buttons">
                        <button onClick={confirmOptionChange}>Confirmer</button>
                        <button onClick={cancelOptionChange}>Annuler</button>
                    </div>
                </div>
            </div>
        )}
        <main className='question_main'>
          {reponseError.toLong ? <p className='question_reponse_to_long'>Votre réponse est beaucoup trop longue</p> : null}
          {reponseError.generation ? <p className='question_reponse_to_long'>Erreur lors de la génération de la réponse</p> : null}
          <textarea style={{resize: "none", caretColor: "auto"}} className='question_response_field' value={response}
            placeholder='Vous devez écrire votre réponse ici' 
            onChange={(event: {target: {value: string}}) => setResponse(event.target.value)}/>
          <div className='question_button_container'>
            <button className='question_button' 
              onClick={() => {
                if(response.length < 10000) {
                  if(questions.length == id) {
                    setCorrection(true);
                    fetchData();
                  } else {
                    handleAnswer(id+1);
                  }
                  sendResponse()
                } else {
                  setReponseError(prevState => ({...prevState, toLong: true}));
                }
                }}
              disabled={response.length > 0 ? false : true}
            >
              prochaine question
            </button>
            <button className='question_boutton_quittez' onClick={() => setShowModal(true)}>quittez</button>
          </div>
        </main>
    </>
  )
}