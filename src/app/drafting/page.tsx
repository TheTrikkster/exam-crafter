"use client"
import React, { useRef, useState } from 'react'
import './Drafting.scss'
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import Footer from '@/components/footer/Footer';
import Menu from '@/components/menu/Menu';
import Pdf from "../../../public/pdf.png"
import Image from 'next/image'

function Drafting() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState(null);
    const [waitAnswer, setWaitAnswer] = useState(true);
    const [chooseDifficulty, setChooseDifficulty] = useState("normal");
    const [lessonText, setLessonText] = useState("");
    const [lessonError, setLessonError] = useState(false);
    const [uploadFile, setUploadFile] = useState(false);
    const [optionPdfOrText, setOptionPdfOrText] = useState("texte");
    const [loading, setLoading] = useState(false);
    const footerRef = useRef<null | any>(null);
    const [showModal, setShowModal] = useState(false);
    const [tempSelectedValue, setTempSelectedValue] = useState<string | null>(null);

    function scrollToFooter() {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const handleOptionChange = (event: any) => {
      const selectedValue = event.target.value;

      if(!selectedFile && lessonText.length == 0) {
        setOptionPdfOrText(selectedValue);
      } else if (selectedValue !== optionPdfOrText) {
        setTempSelectedValue(selectedValue);
        setShowModal(true);
    }
  };

  const confirmOptionChange = () => {
      setShowModal(false);
      
      if(tempSelectedValue) { 
          setOptionPdfOrText(tempSelectedValue);
          setSelectedFile(null);
          setLessonText("");
          setUploadFile(false);
          setWaitAnswer(true);
          setLessonError(false)
      }
  };

  const cancelOptionChange = () => {
      setShowModal(false);
  };

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
    
          if(data.message.message.content == "Ce que vous avez fourni n'est pas une leçon, vous ne pouvez donc pas créer un examen.") {
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
          <div className='drafting_loading'>
            <SyncLoader color="#34495E" size={18} />
            <p className='drafting_loading_text'>Création...</p>
          </div>
        )
      }
    

  return (
    <>
    <Menu scrollToFooter={scrollToFooter}/>
    {showModal && (
        <div className="drafting_modal">
            <div className="drafting_modal_content">
                <p>Êtes-vous sûr de vouloir changer d&#39;option ? <br /> Cela supprimera ce que vous avez déjà fait.</p>
                <div className="drafting_modal_buttons">
                    <button onClick={confirmOptionChange}>Confirmer</button>
                    <button onClick={cancelOptionChange}>Annuler</button>
                </div>
            </div>
        </div>
    )}
    <main>
      <div className='drafting_container'>
        <h1 className='drafting_title'>Pour commencer, insérer le texte ou télécharger un PDF lié à votre sujet d&#39;examen</h1>
        {/* <p className='drafting_container'>
            Pour pouvoir créer votre examen vous pouvez mettre la leçon que vous souhaitez dans le champ ci-dessous manuellement ou par pdf qui ce trouve juste en dessous du champ.
        </p> */}
        <div className='drafting_options_container'>
          <label className='drafting_first_option_title'>
            Choisissez une option: {" "}
            <select className='drafting_option' value={optionPdfOrText} onChange={handleOptionChange}>
              <option>texte</option>
              <option>pdf</option>
            </select>
          </label>

          <label className='drafting_choose_difficulty_container'>
              Vous devez choisir la difficulté de l&#39;examen: {" "}
              <select value={chooseDifficulty} onChange={(event: any) => setChooseDifficulty(event.target.value)}>
                  <option>facile</option>
                  <option>normal</option>
                  <option>difficile</option>
              </select>
          </label>
        </div>

        {lessonError ? <p className='drafting_lesson_error'>Ce que vous avez fourni n&#39;est pas une leçon, vous ne pouvez donc pas créer un examen</p> : null}

        {optionPdfOrText == "pdf" ? 
          <>
            <label htmlFor="file-upload" className={`${uploadFile ? "drafting_pdf_uploaded" : "drafting_pdf_upload"}`}>
                <Image src={Pdf} alt="icon pdf" className="drafting_pdf_icon"/>
            </label>

            <input 
              type="file" 
              id="file-upload" 
              accept="application/pdf" 
              className="drafting_file_input"
              onChange={(event:any) => {
                  setSelectedFile(event.target.files[0])
                  setUploadFile(true)
                  setWaitAnswer(false)
              }}/>
          </> :
            <textarea  
              style={{resize: "none", caretColor: "auto"}} 
              value={lessonText}
              className='drafting_field' 
              placeholder='Ecrivez ici votre texte...'
              onChange={(event: {target: {value: string}}) => {
                setLessonText(event.target.value)
                setWaitAnswer(lessonText.length <= 50);
              }} />
        }

        <button className={`${waitAnswer ? "drafting_button_create_close": "drafting_button_create"}`} onClick={createExam} disabled={waitAnswer}>Créer Exam</button>

      </div>
    </main>
    <Footer footerRef={footerRef} />
    </>
  )
}

export default Drafting;