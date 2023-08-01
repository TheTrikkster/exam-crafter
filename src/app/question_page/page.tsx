'use client'
import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from '../context/store'

function Question() {
  const [number, setNumber] = useState<number>(0)
  const [response, setResponse] = useState<string>("")
  const [responses, setResponses] = useState<string[]>([])
  const [questions, setQuestions] = useState([])
  const [doRequest, setDoRequest] = useState(false)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(null)
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
      console.log(data.message.message)

      setLoading(false)
      setScore(data.message.message.content)
    }

    if(doRequest) {
      fetchData()    
    }
  }, [doRequest])

  return number !== questions.length ? 
    <div>
      {questions.length > 0 ? <p>{questions[number]}</p> : null}
      <textarea style={{resize: "none", caretColor: "auto"}} value={response}
        placeholder='Vous devez écrire votre ici' 
        onChange={(event: {target: {value: string}}) => setResponse(event.target.value)}/>
      <button onClick={() => {
          setResponses((array) => [...array,`Response ${number+1}:` + " " +response])
          setNumber(number => number + 1)
          setResponse("")
          if(questions.length == number + 1) {
            setDoRequest(true)
          }
        }}
        disabled={response.length > 0 ? false : true}
      >
        suivant
      </button>
    </div>
  : 
    loading ? <h1>Loading...</h1> : 
      <div>
        {questions.map((question, index) => {
          return (
            <div key={index}>
              <p>{question}</p>
              <p>{responses[index]}</p>
            </div>
          )
        })}
        <p>{score}</p>
      </div>
}

export default Question