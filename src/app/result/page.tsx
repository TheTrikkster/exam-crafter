'use client'
import React, { useEffect, useState } from 'react';
import "./Result.scss";
import Footer from '@/components/footer/Footer';

function Question() {
  const [responses, setResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [comment, setComment] = useState("");
  const [examUnfinished, setExamUnfinished] = useState(false);
  const [noQuestion, setNoQuestion] = useState(false);
  const [grade, setGrade] = useState("");

  useEffect(() => {
    try {
      const allQuestions = JSON.parse(window.localStorage.getItem("questions") || '[]');
      const allResponses = JSON.parse(window.localStorage.getItem("responses") || '{}');
      const theComment = JSON.parse(window.localStorage.getItem("comment") || '""');
      const allCorrections = JSON.parse(window.localStorage.getItem("corrections") || '[]');
      const theGrade = JSON.parse(window.localStorage.getItem("grade") || '"');

      setNoQuestion(allQuestions.length === 0);
      setExamUnfinished(allCorrections.length > 0);
      
      if(allQuestions.length > 0) {
        setQuestions(allQuestions);
        setResponses(allResponses);
        setComment(theComment);
        setCorrections(allCorrections);
        setGrade(theGrade);
      }
    } catch (error) {
      console.error("Error parsing data from local storage:", error);
    }
  }, [])

  if(noQuestion) {
    return <p className='result_not_show'>Vous devez d&#39;abord créer l&#39;examen</p>;
  };

  if(examUnfinished == false) {
    return <p className='result_not_show'>Vous devez finir l&#39;examen</p>;
  };

  return ( 
    <>
      <div className='result_container'>
        <header className='result_header'>
          <a href="/">Accueil</a>
          <h1 className='result_title'>Correction</h1>
        </header>

        {questions.map((question, index) => {
          const reponse = responses[index+1].slice(12); 
          return (
            <div key={index} className='result_each_result_container'>
              <h3 className='result_question'>{question}</h3>
              <p className='result_response'>{reponse}</p>
              <p className='result_correction'>{corrections[index]}</p>
            </div>
          )
        })}

        <hr />

        <div className='result_comment_grade_container'>
          <p className='result_comment'>{comment}</p>
          <p className='result_grade'>{grade}</p>
        </div>
      </div>
      <Footer/>
    </> 
  )
}

export default Question