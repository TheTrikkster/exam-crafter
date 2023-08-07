'use client'
import React, { useEffect, useState } from 'react';
import "./Questions.scss";
// import { useGlobalContext } from '../context/store'

function Question() {
  const [number, setNumber] = useState<number>(0);
  const [response, setResponse] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState([]);
  const [doRequest, setDoRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [corrections, setCorrections] = useState([]);
  const [comment, setComment] = useState("");
  // const {text, setText} = useGlobalContext();

  useEffect(() => {
    const data:any = window.localStorage.getItem("questions")
    if(JSON.parse(data)[0].length > 0) {
      setQuestions(JSON.parse(data)[0])
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/chatGpt", {
        method: "POST",
        body: JSON.stringify([...questions, ...responses])
      });
  
      if(!response.ok) {
        return;
      };
  
      const data = await response.json();
      const splitCorrectionsAndComment = data.message.message.content.split("startOfComment")
      setComment(splitCorrectionsAndComment[1])
      setCorrections(splitCorrectionsAndComment[0].split("endAndStartOfQuestion"))

      setLoading(false)
    }

    if(doRequest) {
      fetchData()    
    }
  }, [doRequest])

  return number !== questions.length ? 
    <div className='question_container'>
      {questions.length > 0 ? <h3 className='question_the_question'>{questions[number]}</h3> : null}
      <textarea style={{resize: "none", caretColor: "auto"}} className='question_response_field' value={response}
        placeholder='Vous devez écrire votre ici' 
        onChange={(event: {target: {value: string}}) => setResponse(event.target.value)}/>
      <button className='question_button' 
        onClick={() => {
            setResponses((array) => [...array,`Response ${number+1}:` + " " +response])
            setNumber(number => number + 1)
            setResponse("")
            if(questions.length == number + 1) {
              setDoRequest(true)
            }
          }}
        disabled={response.length > 0 ? false : true}
      >
        prochaine question
      </button>
      <a href="/">Quittez</a>
    </div>
  : 
    loading ? 
          <div className='question_loading'>
            <h1>Loading...</h1>
            <p>Vous devrez peut-être attendre un peu.</p>
          </div>
    : 
      <div className='question_result_container'>
        <a href="/">Accueil</a>
        {questions.map((question, index) => {
          // const str = responses[index].slice(0, 10); 
          return (
            <div key={index} className='question_each_result_container'>
              <h3 className='question_question'>{question}</h3>
              <p className='question_response'>{responses[index]}</p>
              <p className='question_result'>{corrections[index+1]}</p>
            </div>
          )
        })}
        <p className='question_comment'>{comment}</p>
      </div>
}

export default Question