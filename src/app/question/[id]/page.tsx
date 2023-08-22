"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./Question.scss"

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
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);

      const waitResponse = await fetch("/api/chatGpt", {
        method: "POST",
        body: JSON.stringify([...questions, ...Object.values(allResponses)])
      });

      if (!waitResponse.ok) {
        throw new Error("Erreur dans la réponse");
      }

      const data = await waitResponse.json();
      const [corrections, commentAndGrade] = data.message.message.content.split("startOfComment");
      const [comment, grade] = commentAndGrade.split("gradeOfExam");

      window.localStorage.setItem("comment", JSON.stringify(comment.trim()));
      window.localStorage.setItem("corrections", JSON.stringify(corrections.split("endAndStartOfQuestion")));
      window.localStorage.setItem("grade", JSON.stringify(grade.trim()));

      router.push(`/result`);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
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
      <div>
        <p>404 page not found</p>
      </div>
    )
  }

  if (correction) {
    return (
      <div className='question_loading'>
        <p className='question_loading_text'>correction en cours...</p>
      </div>
    ) 
  }

  if (loading) {
    return (
      <div className='question_loading'>
        <p className='question_loading_text'>Loading...</p>
      </div>
    ) 
  }


  return (
      <div className='question_container'>
        {questions.length > 0 ? <h3 className='question_the_question'>{questions[id - 1]}</h3> : null}
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
                    setLoading(true);
                    handleAnswer(id+1);
                  }
                }}
              disabled={response.length > 0 ? false : true}
            >
              prochaine question
            </button>
            <a href="/" className='question_boutton_quittez' onClick={removeEleFromLocStorage}>quittez</a>
          </div>
      </div>
    )
}

export default QuestionPage;