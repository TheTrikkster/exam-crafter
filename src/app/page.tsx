"use client";
import { useState } from 'react';
import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [waitAnswer, setWaitAnswer] = useState(true);
  const [chooseDifficulty, setChooseDifficulty] = useState("normal");
  const [lessonText, setLessonText] = useState("");
  const [lessonError, setLessonError] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const [loading, setLoading] = useState(false);

  const createExam = async () => {
    try {
      setLoading(true)
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
      // console.log(data.message.message.content)

      if(data.message.message.content == "Ce que vous avez fourni n'est pas un cours, je ne peux donc pas vous faire passer un examen.") {
        setLoading(false)
        setLessonError(true)
      } else {
        const questions = data.message.message.content.split("startEndOfQuestion");
        questions.pop();
        window.localStorage.setItem("questions", JSON.stringify(questions));
        window.localStorage.setItem("responses", JSON.stringify({}));
        window.localStorage.setItem("comment", JSON.stringify(""));
        window.localStorage.setItem("corrections", JSON.stringify([]));
        router.push(`/question/1`);
      }
    } catch(error) {
      console.error("Quelque chose s'est mal passé");
    }
  };

  if(loading) {
    return(
      <div className='main_loading'>
        <SyncLoader color="#34495E" size={18} />
        <p className='main_loading_text'>Création...</p>
      </div>
    )
  }

  return (
      <>
        <Headers 
          description="Créez un examen personnalisé à partir d'une leçon fournir. L'IA génère un examen basé sur la leçon pour aider les étudiants à s'entraîner et à s'améliorer." 
          keywords="IA, examen personnalisé, entraînement étudiant, amélioration des compétences" 
        />
        <main className='main_container'>

          <p className='main_explication_text'>
            Pour pouvoir créer votre examen vous pouvez mettre la leçon que vous souhaitez dans le champ ci-dessous manuellement ou par pdf qui ce trouve juste en dessous du champ.
          </p>

          <textarea  
            style={{resize: "none", caretColor: "auto"}} 
            value={lessonText}
            className='main_field' 
            placeholder='Ecrivez ici votre texte...'
            onChange={(event: {target: {value: string}}) => {
              setLessonText(event.target.value)
              setWaitAnswer(lessonText.length <= 50);
            }}
          />

          <hr className='main_split_trait' />

          <label htmlFor="file-upload" className={`${uploadFile ? "main_pdf_uploaded" : "main_pdf_upload"}`}>
            Choisir PDF
          </label>

          <input 
            type="file" 
            id="file-upload" 
            accept="application/pdf" 
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
            <option>difficile</option>
          </select>
          </label>

          {/* <a href="/chemin/vers/votre/fichier.pdf" download>Télécharger le PDF</a> */}
          <button className='main_button_create' onClick={createExam} disabled={waitAnswer}>Créer Exam</button>

          {lessonError ? <p className='main_lesson_error'>Ce que vous avez fourni n&#39;est pas un cours, je ne peux donc pas vous faire passer un examen.</p> : null}
        </main>
        <Footer />
      </>
  )
}
