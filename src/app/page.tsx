"use client";
import { useState } from 'react';
import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [exam, setExam] = useState("");
  const [waitAnswer, setWaitAnswer] = useState(false);
  const [chooseDifficulty, setChooseDifficulty] = useState("normal");

  const createExam = async () => {
    try {
      // const body = selectedFile + `The difficulty i want to choose is ${chooseDifficulty}`
      const formData = new FormData();

      console.log(selectedFile)

      if(selectedFile) {
        formData.append("file", selectedFile);
        formData.append('role', 'user');
      }

      const response = await fetch("/api/chatGpt", {
        method: "POST",
        body: JSON.stringify({hello: "world"})
      });

      if(!response.ok) {
        return;
      };

      const data = await response.json()
      setExam(data)
    } catch(error:any) {
      console.error(error.message)
    } 
  };
  
  console.log(selectedFile, "hello")
  console.log("israil")

  return (
    <>
    <Headers />
    <main className='main_container'>
      <p className='main_explication_text'>Pour pouvoir créer votre examen vous pouvez mettre la leçon que vous souhaitez dans le champ 
        ci-dessous manuellement ou par pdf qui ce trouve juste en dessous du champ.</p>
      <textarea  style={{resize: "none", caretColor: "auto"}} className='main_field' placeholder='Ecrivez ici votre texte...'/>
      <hr className='main_split_trait' />
      <label htmlFor="file-upload" className="main_pdf-upload">
        Choisir PDF
      </label>
      <select value={chooseDifficulty} onChange={(event: any) => setChooseDifficulty(event.target.value)}>
        <option>facile</option>
        <option>normal</option>
        <option>dificile</option>
      </select>
      <input type="file" id="file-upload" accept="application/pdf" onChange={(event:any) => setSelectedFile(event.target.files[0])} style={{display: 'none'}}/>
      {/* <a href="/chemin/vers/votre/fichier.pdf" download>Télécharger le PDF</a> */}
      <button className='main_button_create' onClick={createExam}>Créer</button>

      {/* {waitAnswer ? <p>{exam}</p> : <h2>Loading...</h2>} */}
    </main>
    <Footer />
    </>
  )
}
