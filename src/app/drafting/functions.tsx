"use client"
import React, { useState } from 'react'
import './Drafting.scss';
import { SyncLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Pdf from "../../../public/pdf.png"
import Menu from '@/components/menu/Menu';
import Footer from '@/components/footer/Footer';

type ErrorDrafting = {
    notLesson: boolean, 
    toLong: boolean, 
    toShort: boolean, 
    convertPDF: boolean, 
    generation: boolean
}

export const DraftingFunctions = () => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [waitAnswer, setWaitAnswer] = useState<boolean>(true);
    const [lessonText, setLessonText] = useState<string>("");
    const [lessonError, setLessonError] = useState<ErrorDrafting>({notLesson: false, toLong: false, toShort: false, convertPDF: false, generation: false});
    const [uploadFile, setUploadFile] = useState<boolean>(false);
    const [optionPdfOrText, setOptionPdfOrText] = useState<string>("texte");
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [tempSelectedValue, setTempSelectedValue] = useState<string | null>(null);

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
            setLessonError({notLesson: false, toLong: false, toShort: false, convertPDF: false, generation: false})
        }
    };
  
    const cancelOptionChange = () => {
        setShowModal(false);
    };
  
    const request = async (formData: FormData, choosedPrompt: string) => {
      try {
        formData.append("choosedPrompt", choosedPrompt);
  
        const response = await fetch("/api/create_exam", {
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
            
            if(selectedFile) {
                formData.append("lesson", selectedFile);
            } else if(lessonText) {
                formData.append("lesson", lessonText); 
            }

            const check = await request(formData, "check")
            setLoading(false)
            if(check == "Le contenu fourni est trop court") {
                setLessonError(prevState => ({ ...prevState, toShort: true }))
            } else if(check == "Le contenu fourni est trop volumineux") {
                setLessonError(prevState => ({ ...prevState, toLong: true }))
            } else if(check == "Erreur lors de la conversion du PDF en texte.") {
                setLessonError(prevState => ({ ...prevState, convertPDF: true }))
            } else if(check == "Erreur lors de la génération de la réponse.") {
                setLessonError(prevState => ({ ...prevState, generation: true }))
            } else if(check == "INVALID") {
                setLessonError(prevState => ({ ...prevState, notLesson: true }))
            } else {
                setLoading(true)
                const lesson = await request(formData, "lesson")
                const questions = lesson.split("endOfQuestion");
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
            <p className='drafting_loading_text'>création</p>
        </div>
        )
    }

    return (
        <>
            <Menu />
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
                    <label className='drafting_first_option_title'>
                        Choisissez une option: {" "}
                        <select className='drafting_option' value={optionPdfOrText} onChange={handleOptionChange}>
                        <option>texte</option>
                        <option>pdf</option>
                        </select>
                    </label>

                    {lessonError.notLesson ? <p className='drafting_lesson_error'>Ce que vous avez fourni n&#39;est pas une leçon, vous ne pouvez donc pas créer un examen</p> : null}
                    {lessonError.toLong ? <p className='drafting_lesson_error'>Le contenu fourni est trop volumineux</p> : null}
                    {lessonError.toShort ? <p className='drafting_lesson_error'>Le contenu fourni est trop court</p> : null}
                    {lessonError.generation || lessonError.convertPDF ? <p className='drafting_lesson_error'>Erreur lors de la génération de l&#39;examen</p> : null}

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
                        placeholder={`Vous devez écrire au moins 30 caractères pour pouvoir commencer \n \nEcrivez votre texte ici...`}
                        onChange={(event: {target: {value: string}}) => {
                            const currentTextValue = event.target.value;
                            setLessonText(currentTextValue);
                            setWaitAnswer(currentTextValue.length <= 30);
                        }} />
                    }

                    <button className={`${waitAnswer ? "drafting_button_create_close": "drafting_button_create"}`} onClick={createExam} disabled={waitAnswer}>Créer Exam</button>
                </div>
            </main>
            <Footer />
        </>
    )
}