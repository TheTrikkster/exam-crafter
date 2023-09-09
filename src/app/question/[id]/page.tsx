"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./Question.scss"
import { SyncLoader } from 'react-spinners';
import Head from 'next/head';

type QuestionPageType = {
  params: {id: string}
}

function QuestionPage({params}: QuestionPageType) {
  const id = Number(params.id);
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [allResponses, setAllResponses] = useState<{ [key: string]: string }>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [sendResponse, setSendResponse] = useState<boolean>(false);
  const [correction, setCorrection] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const questionsFromStorage = JSON.parse(window.localStorage.getItem("questions") || '[]');
      if (questionsFromStorage.length > 0) {
        setQuestions(questionsFromStorage);
      }

      const responsesFromStorage = JSON.parse(window.localStorage.getItem("responses") || '{}');
      setAllResponses(responsesFromStorage);

      if (sendResponse) {
        allResponses[id] = `Response ${id}: ${response}`;
        window.localStorage.setItem("responses", JSON.stringify(allResponses));
      }
    } catch (error) {
      console.error("Error parsing data from local storage:", error);
    }
  }, [sendResponse]);

  const request = async (question: string, index: number, choosedPrompt: string) => {
    try{
      const waitResponse = await fetch("/api/chatGpt", {
        method: "POST",
        body: choosedPrompt == "comment" ? JSON.stringify({data: [...questions, ...Object.values(allResponses)], choosedPrompt: "comment"}) : JSON.stringify({data: [question, allResponses[index+1]], choosedPrompt: choosedPrompt})
      });

      if (!waitResponse.ok) {
        throw new Error("Erreur dans la réponse");
      }

      const data = await waitResponse.json();

      return data.message.message.content
    } catch(err) {
      console.error(err)
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
    window.localStorage.setItem("comment", JSON.stringify(comment.trim()));
    window.localStorage.setItem("corrections", JSON.stringify(allCorrections));

    router.push(`/result`);
  }

  const confirmOptionChange = () => {
    setShowModal(false);
    window.localStorage.setItem("questions", JSON.stringify([]));
    window.localStorage.setItem("responses", JSON.stringify({}));
    window.localStorage.setItem("comment", JSON.stringify(""));
    window.localStorage.setItem("corrections", JSON.stringify([]));
    router.push(`/`);
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
  
  if (Object.keys(allResponses).length !== id-1) {
    return (
      <div className='question_loading_or_do_not_exist'>
        <p className='question_loading_text_or_do_not_exist'>Cette page n&#39;est pas disponible</p>
      </div>
    )
  }

  if (correction) {
    return (
      <div className='question_loading_or_do_not_exist'>
        <SyncLoader color="#34495E" size={18} />
        <p className='question_loading_text_or_do_not_exist'>Correction...</p>
      </div>
    ) 
  }

  return (
      <div className='question_container'>
        <Head>
          <meta name="description" content="Répondez à la question pour progresser dans l'examen. Chaque réponse est importante pour votre évaluation finale." />      
          <meta name="keywords" content="examen, question, IA, examen personnalisé"/>
          <meta property="og:title" content="Exeam Crafter" />
          <meta property="og:description" content="Répondez à la question pour progresser dans l'examen. Chaque réponse est importante pour votre évaluation finale." />
          <meta property="og:image" content="URL_DE_VOTRE_IMAGE" /> {/* Si vous avez une image représentative pour votre site */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="URL_COMPLET_DE_LA_PAGE" /> {/* Mettre l'url de la page d'accueil */}
        </Head>
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
          <textarea style={{resize: "none", caretColor: "auto"}} className='question_response_field' value={response}
            placeholder='Vous devez écrire votre réponse ici' 
            onChange={(event: {target: {value: string}}) => setResponse(event.target.value)}/>
          <div className='question_button_container'>
            <button className='question_button' 
              onClick={() => {
                  setSendResponse(true);
                  if(questions.length == id) {
                    setCorrection(true);
                    fetchData();
                  } else {
                    handleAnswer(id+1);
                  }
                }}
              disabled={response.length > 0 ? false : true}
            >
              prochaine question
            </button>
            <button className='question_boutton_quittez' onClick={() => setShowModal(true)}>quittez</button>
          </div>
        </main>
      </div>
    )
}

export default QuestionPage;