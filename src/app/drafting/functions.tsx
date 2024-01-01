"use client";
import React, { Fragment, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Pdf from "../../../public/pdf.png";
import Menu from "@/components/menu/Menu";
import Footer from "@/components/footer/Footer";

type ErrorDrafting = {
  notLesson: boolean;
  toLong: boolean;
  toShort: boolean;
  convertPDF: boolean;
  generation: boolean;
};

export const DraftingFunctions = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [waitAnswer, setWaitAnswer] = useState<boolean>(true);
  const [lessonText, setLessonText] = useState<string>("");
  const [lessonError, setLessonError] = useState<ErrorDrafting>({
    notLesson: false,
    toLong: false,
    toShort: false,
    convertPDF: false,
    generation: false,
  });
  const [uploadFile, setUploadFile] = useState<boolean>(false);
  const [optionPdfOrText, setOptionPdfOrText] = useState<string>("texte");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tempSelectedValue, setTempSelectedValue] = useState<string | null>(
    null,
  );

  const handleOptionChange = (event: { target: { value: string } }) => {
    const selectedValue = event.target.value;

    if (!selectedFile && lessonText.length == 0) {
      setOptionPdfOrText(selectedValue);
    } else if (selectedValue !== optionPdfOrText) {
      setTempSelectedValue(selectedValue);
      setShowModal(true);
    }
  };

  const confirmOptionChange = () => {
    setShowModal(false);

    if (tempSelectedValue) {
      setOptionPdfOrText(tempSelectedValue);
      setSelectedFile(null);
      setLessonText("");
      setUploadFile(false);
      setWaitAnswer(true);
      setLessonError({
        notLesson: false,
        toLong: false,
        toShort: false,
        convertPDF: false,
        generation: false,
      });
    }
  };

  const cancelOptionChange = () => {
    setShowModal(false);
  };

  const checkStatus: (id: string) => object | string = async (id) => {
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Erreur lors de la vérification du statut");
        return;
      }

      const data = await response.json();

      if (data.status === "pending") {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return await checkStatus(id);
      } else if (data.status === "ready") {
        return data.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const request = async (formData: FormData, choosedPrompt: string) => {
    try {
      formData.append("choosedPrompt", choosedPrompt);

      const response = await fetch("/api/create_exam", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const id = await response.json();
      if (id.error) {
        return id.error;
      }
      return await checkStatus(id.id);
    } catch (err) {
      console.error(err);
    }
  };

  const createExam = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (selectedFile) {
        formData.append("lesson", selectedFile);
      } else if (lessonText) {
        formData.append("lesson", lessonText);
      }

      const check = await request(formData, "check");
      setLoading(false);
      switch (check) {
        case "Le contenu fourni est trop court":
          setLessonError((prevState) => ({ ...prevState, toShort: true }));
          break;
        case "Le contenu fourni est trop volumineux":
          setLessonError((prevState) => ({ ...prevState, toLong: true }));
          break;
        case "Erreur lors de la conversion du PDF en texte.":
          setLessonError((prevState) => ({ ...prevState, convertPDF: true }));
          break;
        case "Erreur lors de la génération de la réponse.":
          setLessonError((prevState) => ({ ...prevState, generation: true }));
          break;
        case "INVALID":
          setLessonError((prevState) => ({ ...prevState, notLesson: true }));
          break;
        default:
          setLoading(true);

          if (formData) {
            const questions = await request(formData, "lesson");
            window.localStorage.setItem("questions", JSON.stringify(questions));
            window.localStorage.setItem("responses", JSON.stringify({}));
            window.localStorage.setItem("comment", JSON.stringify(""));
            window.localStorage.setItem("corrections", JSON.stringify([]));
            router.push(`/question/1`);
          }
      }
    } catch (error) {
      console.error("Quelque chose s'est mal passé");
    }
  };

  const handleLesson = (event: { target: { value: string } }) => {
    const currentTextValue = event.target.value;
    setLessonText(currentTextValue);
    setWaitAnswer(currentTextValue.length <= 30);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectLessonPdf = (event: any) => {
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
  };

  if (loading) {
    return (
      <div className="Drafting_loading">
        <SyncLoader color="#34495E" size={18} />
        <p className="Drafting_loading_text">création</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Menu />
      {showModal && (
        <div className="Drafting_modal">
          <div className="Drafting_modal_content">
            <p>
              Êtes-vous sûr de vouloir changer d&#39;option ? <br /> Cela
              supprimera ce que vous avez déjà fait.
            </p>
            <div className="Drafting_modal_buttons">
              <button onClick={confirmOptionChange}>Confirmer</button>
              <button onClick={cancelOptionChange}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      <main>
        <div className="Drafting_container">
          <h1 className="Drafting_title">
            Pour commencer, insérer le texte ou télécharger un PDF lié à votre
            sujet d&#39;examen
          </h1>
          <label className="Drafting_first_option_title">
            Choisissez une option:{" "}
            <select
              className="Drafting_option"
              value={optionPdfOrText}
              onChange={handleOptionChange}
            >
              <option>texte</option>
              <option>pdf</option>
            </select>
          </label>
          {lessonError.notLesson ||
          lessonError.toLong ||
          lessonError.toShort ||
          lessonError.generation ||
          lessonError.convertPDF ? (
            <p className="Drafting_lesson_error">
              {lessonError.notLesson
                ? "Ce que vous avez fourni n'est pas une leçon, vous ne pouvez donc pas créer un examen"
                : lessonError.toLong
                  ? "Le contenu fourni est trop volumineux"
                  : lessonError.toShort
                    ? "Le contenu fourni est trop court"
                    : "Erreur lors de la génération de l'examen"}
            </p>
          ) : null}

          {optionPdfOrText == "pdf" ? (
            <Fragment>
              <label
                htmlFor="file-upload"
                className={`${
                  uploadFile ? "Drafting_pdf_uploaded" : "Drafting_pdf_upload"
                }`}
              >
                <Image src={Pdf} alt="icon pdf" className="Drafting_pdf_icon" />
              </label>

              <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                className="Drafting_file_input"
                data-testid="file-upload"
                onChange={selectLessonPdf}
              />
            </Fragment>
          ) : (
            <textarea
              style={{ resize: "none", caretColor: "auto" }}
              value={lessonText}
              className="Drafting_field"
              placeholder={`Vous devez écrire au moins 30 caractères pour pouvoir commencer \n \nEcrivez votre texte ici...`}
              onChange={handleLesson}
            />
          )}

          <button
            className={`${
              waitAnswer
                ? "Drafting_button_create_close"
                : "Drafting_button_create"
            }`}
            onClick={createExam}
            disabled={waitAnswer}
          >
            Créer Exam
          </button>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
};
