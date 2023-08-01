"use client";
import { useState } from 'react';
import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useGlobalContext } from './context/store';

type ExamType = {
    role: string,
    content: string
}

export default function Home() {
  const {setText} = useGlobalContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [exam, setExam] = useState<ExamType | null>(null);
  const [waitAnswer, setWaitAnswer] = useState(true);
  const [chooseDifficulty, setChooseDifficulty] = useState("normal");
  const [lessonText, setLessonText] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);

  const createExam = async () => {
    try {
      const formData = new FormData();

      formData.append("difficulty", chooseDifficulty);

      if(selectedFile) {
        formData.append("lesson", selectedFile);
      } else if(lessonText) {
        formData.append("lesson", lessonText);
      }

      const response = await fetch("/api/chatGpt", {
        method: "POST",
        body: formData
      });

      if(!response.ok) {
        return;
      };

      const data = await response.json();
      const questions = data.message.message.content.split("endOfQuestion");
      questions.pop();
      setExam(data.message.message);
      setText(questions)
      setAllQuestions(questions);
      window.localStorage.setItem("questions", JSON.stringify([questions, 0]));
    } catch(error:any) {
      console.error(error.message);
    } 
  };

  console.log(allQuestions)

  return (
    <>
    <Headers />
    <main className='main_container'>
      <p className='main_explication_text'>Pour pouvoir créer votre examen vous pouvez mettre la leçon que vous souhaitez dans le champ 
        ci-dessous manuellement ou par pdf qui ce trouve juste en dessous du champ.</p>
      <textarea  style={{resize: "none", caretColor: "auto"}} 
      value={lessonText}
      className='main_field' 
      placeholder='Ecrivez ici votre texte...'
      onChange={(event: {target: {value: string}}) => {
        setLessonText(event.target.value)
        if(lessonText.length > 50) {
          setWaitAnswer(false);
        } else {
          setWaitAnswer(true);
        }
      }}
      />
      <hr className='main_split_trait' />
      <label htmlFor="file-upload" className="main_pdf-upload">
        Choisir PDF
      </label>
      <select value={chooseDifficulty} onChange={(event: any) => setChooseDifficulty(event.target.value)}>
        <option>facile</option>
        <option>normal</option>
        <option>dificile</option>
      </select>
      <input type="file" id="file-upload" accept="application/pdf" 
        onChange={(event:any) => {
          setSelectedFile(event.target.files[0])
          setWaitAnswer(false)
      }} 
      style={{display: 'none'}}/>

      {allQuestions ? allQuestions.map((question: string, index: number) => {
        return (
          <div key={index}>
            <p>{question}</p>
          </div>
        )
      }) : null}
      {/* <a href="/chemin/vers/votre/fichier.pdf" download>Télécharger le PDF</a> */}
      <button className='main_button_create' onClick={createExam} disabled={waitAnswer}>Créer</button>
    </main>
    <Footer />
    </>
  )
}
