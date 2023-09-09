"use client"
import React, { useRef, useState } from 'react'
import './Drafting.scss'
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import Footer from '@/components/footer/Footer';
import Menu from '@/components/menu/Menu';
import Pdf from "../../../public/pdf.png"
import Image from 'next/image'
import Head from 'next/head';

function Drafting() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [waitAnswer, setWaitAnswer] = useState<boolean>(true);
    const [chooseDifficulty, setChooseDifficulty] = useState<string>("normal");
    const [lessonText, setLessonText] = useState<string>("");
    const [lessonError, setLessonError] = useState<boolean>(false);
    const [uploadFile, setUploadFile] = useState<boolean>(false);
    const [optionPdfOrText, setOptionPdfOrText] = useState<string>("texte");
    const [loading, setLoading] = useState<boolean>(false);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [tempSelectedValue, setTempSelectedValue] = useState<string | null>(null);

    function scrollToFooter() {
      if (footerRef.current) {
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
      }  
    }

    const handleOptionChange = (event: {target: {value: string}}) => {
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

  const request = async (formData: FormData, choosedPrompt: string) => {
    try {
      formData.append("choosedPrompt", choosedPrompt);

      const response = await fetch("/api/chatGpt", {
        method: "POST",
        body: formData
      });

      if(!response.ok) {
        return;
      };

      const data = await response.json();

      return data.message.message.content
    } catch (err) {
      console.error(err);
    }
  }

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

          const check = await request(formData, "check")
    
          if(check == "Ce que vous avez fourni n'est pas une leçon, vous ne pouvez donc pas créer un examen.") {
            setLoading(false)
            setLessonError(true)
          } else {
            const lesson = await request(formData, "lesson")
            const questions = lesson.split("startEndOfQuestion");
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
    <Head>
      <meta name="description" content="Personnalisez votre examen avec Exeam Crafter. Fournissez une leçon et laissez l'IA créer un examen sur mesure pour une préparation optimale." />
      <meta name="keywords" content="créer examen, examen sur mesure, IA, personnalisation, leçon, étude, préparation examen"/>
      <meta property="og:title" content="Créez Votre Examen Personnalisé | Exeam Crafter" />
      <meta property="og:description" content="Personnalisez votre examen avec Exeam Crafter. Fournissez une leçon et l'IA se charge de créer un examen adapté pour votre préparation." />
      <meta property="og:image" content="URL_DE_L_IMAGE_POUR_CETTE_PAGE" /> {/* Utilisez une image qui représente bien cette fonctionnalité si possible */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="URL_COMPLET_DE_LA_PAGE" /> {/* Mettre l'url de la page d'accueil */}
    </Head>

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
              <select value={chooseDifficulty} onChange={(event: {target: {value: string}}) => setChooseDifficulty(event.target.value)}>
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
              onChange={(event) => {
                const files = event.target.files;
        
                if (files && files.length > 0) {
                    const file = files[0];
        
                    if (file.type === "application/pdf") {
                        setSelectedFile(file);
                        setUploadFile(true);
                        setWaitAnswer(false);
                    } else {
                        alert("Veuillez télécharger un fichier PDF valide.");
                    }
                }
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