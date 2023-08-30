"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./Question.scss"
import { SyncLoader } from 'react-spinners';

type QuestionPageType = {
  params: {id: string}
}

function QuestionPage({params}: QuestionPageType) {
  const id = Number(params.id);
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [allResponses, setAllResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState([]);
  const [sendResponse, setSendResponse] = useState(false);
  const [correction, setCorrection] = useState(false);

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


  const fetchData = async () => {
    const allCorrections = await Promise.all(questions.map(async (question: string, index: number) => {
      try {
        const waitResponse = await fetch("/api/chatGpt", {
          method: "POST",
          body: JSON.stringify({data: [question, allResponses[index+1]], choosedPrompt: "response"})
        });

        if (!waitResponse.ok) {
          throw new Error("Erreur dans la réponse");
        }

        const dataFromWaitResponse = await waitResponse.json();

        const waitGrade = await fetch("/api/chatGpt", {
          method: "POST",
          body: JSON.stringify({data: [question, allResponses[index+1]], choosedPrompt: "grade"})
        });

        if (!waitGrade.ok) {
          throw new Error("Erreur dans la réponse");
        }

        const dataFromWaitGrade = await waitGrade.json();

        return {correction: dataFromWaitResponse.message.message.content, grade: dataFromWaitGrade.message.message.content}
      } catch (error) {
        console.error(error)
      }
    }))

    try {
      const waitComment = await fetch("/api/chatGpt", {
        method: "POST",
        body: JSON.stringify({data: [...questions, ...Object.values(allResponses)], choosedPrompt: "comment"})
      });

      if (!waitComment.ok) {
        throw new Error("Erreur dans la réponse");
      }

      const dataFromWaitComment = await waitComment.json();

      // console.log(data.message.message.content)
      // const [corrections, commentAndGrade] = data.message.message.content.split("startEndOfComment");
      // const [comment, grade] = commentAndGrade.split("startEndOfGrade");

      // window.localStorage.setItem("comment", JSON.stringify(comment.trim()));
      window.localStorage.setItem("comment", JSON.stringify(dataFromWaitComment.message.message.content.trim()));
      // window.localStorage.setItem("corrections", JSON.stringify(corrections.split("startEndOfCorrection")));
      window.localStorage.setItem("corrections", JSON.stringify(allCorrections));
      // window.localStorage.setItem("grade", JSON.stringify(grade.trim()));

      router.push(`/result`);
    } catch (err: any) {
      console.error(err.message);
    } 
  }

  const removeEleFromLocStorage = () => {
    window.localStorage.setItem("questions", JSON.stringify([]));
    window.localStorage.setItem("responses", JSON.stringify({}));
    window.localStorage.setItem("comment", JSON.stringify(""));
    window.localStorage.setItem("corrections", JSON.stringify([]));
  }

  const handleAnswer = (nextQuestionId:any) => {
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
        <p className='question_loading_text_or_do_not_exist'>Correction...</p>
      </div>
    ) 
  }

  return (
      <div className='question_container'>
        <header>
          {questions.length > 0 ? <h3 className='question_the_question'>{questions[id - 1]}</h3> : null}
        </header>
        <main className='question_main'>
          <textarea style={{resize: "none", caretColor: "auto"}} className='question_response_field' value={response}
            placeholder='Vous devez écrire votre ici' 
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
            <a href="/" className='question_boutton_quittez' title="Quitter le quiz et retourner à la page d'accueil" onClick={removeEleFromLocStorage}>quittez</a>
          </div>
        </main>
      </div>
    )
}

export default QuestionPage;