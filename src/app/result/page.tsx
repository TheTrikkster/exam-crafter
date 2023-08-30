'use client'
import React, { useEffect, useState } from 'react';
import "./Result.scss";
import Footer from '@/components/footer/Footer';


function Result() {
  const [responses, setResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<{correction: string, grade: string}[]>([]);
  const [comment, setComment] = useState<string>("");
  const [examUnfinished, setExamUnfinished] = useState<boolean>(false);
  const [noQuestion, setNoQuestion] = useState<boolean>(false);
  const [grade, setGrade] = useState<number>(0);

  useEffect(() => {
    try {
      const allQuestions = JSON.parse(window.localStorage.getItem("questions") || '[]');
      const allResponses = JSON.parse(window.localStorage.getItem("responses") || '{}');
      const theComment = JSON.parse(window.localStorage.getItem("comment") || '""');
      const allCorrections = JSON.parse(window.localStorage.getItem("corrections") || '[]');
      // const theGrade = JSON.parse(window.localStorage.getItem("grade") || '"');

      setNoQuestion(allQuestions.length === 0);
      setExamUnfinished(allCorrections.length < 10);
      
      if(allQuestions.length > 0) {
        setQuestions(allQuestions);
        setResponses(allResponses);
        setComment(theComment);
        setCorrections(allCorrections);
        // setGrade(theGrade);
        const totalGrade = allCorrections.reduce((sum:number, current: {correction: string, grade: string}) => sum + Number(current.grade), 0);
        setGrade(totalGrade);
      }
    } catch (error) {
      console.error("Error parsing data from local storage:", error);
    }
  }, [])

  if(noQuestion) {
    return (
      <div className='result_not_show'>
        <p className='result_not_show_text'>Vous devez d&#39;abord créer l&#39;examen</p>
      </div>
    )
  };

  if(examUnfinished) {
    return (
      <div className='result_not_show'>
         <p className='result_not_show_text'>Vous devez finir l&#39;examen</p>
      </div>
    )
  };

  return ( 
    <>
      <div className='result_container'>
        <header className='result_header'>
          <a href="/" title="Retourner à l'accueil">Accueil</a>
          <h1 className='result_title'>Correction</h1>
        </header>
        <main>
          <section>
            {questions.map((question: string, index: number) => {
              const reponse = responses[index+1].slice(12);

              return (
                <div key={index} className='result_each_result_container'>
                  <h3 className='result_question'>{question}</h3>
                  <p className='result_response'>{reponse}</p>
                  <p className='result_correction'>{corrections[index].correction}</p>
                </div>
              )
            })}
          </section>

          <hr />

          <section className='result_comment_grade_container'>
            <p className='result_comment'>{comment}</p>
            <p className='result_grade'>Note: {grade}/10</p>
          </section>
        </main>
      </div>
      <Footer/>
    </> 
  )
}

export default Result;