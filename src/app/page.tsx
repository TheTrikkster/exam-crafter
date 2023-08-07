"use client";
import { useState } from 'react';
import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useGlobalContext } from './context/store';

export default function Home() {
  const {setText} = useGlobalContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [waitAnswer, setWaitAnswer] = useState(true);
  const [chooseDifficulty, setChooseDifficulty] = useState("normal");
  const [lessonText, setLessonText] = useState("");
  const [lessonError, setLessonError] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if(data.message.message.content == "Ce que vous avez fourni n'est pas une leçon, donc je ne peux pas vous donner d'examen.") {
        setLessonError(true)
      } else {
        setLoading(true)
        const questions = data.message.message.content.split("endOfQuestion");
        questions.pop();
        setText(questions)
        window.localStorage.setItem("questions", JSON.stringify([questions, 0]));
        window.location.href = "/questions"
      }
    } catch(error:any) {
      console.error(error.message);
    }
  };

  return loading ? 
      <div className='main_loading'>
            <h1>Loading...</h1>
            <p>Vous devrez peut-être attendre un peu.</p>
      </div>
    :
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
          <label htmlFor="file-upload" className={`${uploadFile ? "main_pdf_uploaded" : "main_pdf_upload"}`}>
            Choisir PDF
          </label>
          <input type="file" id="file-upload" accept="application/pdf" 
            onChange={(event:any) => {
              setSelectedFile(event.target.files[0])
              setUploadFile(true)
              setWaitAnswer(false)
          }} 
          style={{display: 'none'}}/>
          <label className='main_choose_difficulty_container'>
            Vous devez choisir la difficulté de l&#39;examen qui sera créé: {" "}
            <select value={chooseDifficulty} onChange={(event: any) => setChooseDifficulty(event.target.value)}>
            <option>facile</option>
            <option>normal</option>
            <option>dificile</option>
          </select>
          </label>
          {/* <a href="/chemin/vers/votre/fichier.pdf" download>Télécharger le PDF</a> */}
          <button className='main_button_create' onClick={createExam} disabled={waitAnswer}>Créer Exam</button>
          {lessonError ? <p className='main_lesson_error'>Ce que vous avez fourni n&#39;est pas une leçon, donc je ne peux pas vous donner d&#39;examen.</p> : null}
        </main>
        <Footer />
      </>
}
