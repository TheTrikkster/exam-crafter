"use client";
import React, { useState, useCallback, Fragment } from "react";
import "./ShowQuestions.scss";
import { useRouter } from "next/navigation";
import { ClipLoader, SyncLoader } from "react-spinners";
import Image from "next/image";
import Reload from "../../../public/reload.png";
import NewQuestions from "../../../public/nouveaux-questions.png";
import { useAppContext } from "@/app/context";
import Menu from "@/components/menu/Menu";
import Footer from "@/components/footer/Footer";

interface AbortError extends Error {
  name: "AbortError";
}

export function isAbortError(error: unknown): error is AbortError {
  return (error as AbortError).name === "AbortError";
}

function ShowQuestionsFunction() {
  const router = useRouter();
  const [changingQuestion, setChangingQuestion] = useState<
    Record<number, boolean>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const {
    selectedOptions,
    numberOfChange,
    setNumberOfChange,
    canChangeAllQuestions,
    setCanChangeAllQuestions,
    generatedQuestions,
    setGeneratedQuestions,
    request,
  } = useAppContext();
  const [disableChange, setDisableChange] = useState<boolean>(
    numberOfChange === 0,
  );

  const changeQuestion = useCallback(
    async (question: string, index: number) => {
      if (numberOfChange === 0 || disableChange) {
        return;
      }
      setDisableChange(true);
      setChangingQuestion((prevState) => ({ ...prevState, [index]: true }));

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_API_URL}/create-exam`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedOptions,
            selectedQuestion: question,
            allQuestions: generatedQuestions,
          }),
          signal: new AbortController().signal,
        });

        if (!response.ok) throw new Error("La requête a échoué");

        const newQuestions = await response.json();
        setGeneratedQuestions(newQuestions);

        setNumberOfChange((prevState) => {
          const newNumberOfChange = prevState - 1;
          setDisableChange(newNumberOfChange === 0);
          return newNumberOfChange;
        });
      } catch (error: unknown) {
        if (isAbortError(error)) {
          console.error(
            "La requête a été annulée à cause du délai d'expiration",
          );
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Une erreur inconnue est survenue");
        }
        setDisableChange(false);
      } finally {
        setChangingQuestion((prevState) => ({ ...prevState, [index]: false }));
      }
    },
    [
      numberOfChange,
      disableChange,
      selectedOptions,
      generatedQuestions,
      setGeneratedQuestions,
      setNumberOfChange,
    ],
  );

  const startExam = useCallback(() => {
    if (generatedQuestions.length.toString() === selectedOptions.questions) {
      localStorage.setItem(
        "appState",
        JSON.stringify({
          generatedQuestions: [],
          numberOfChange: 5,
          canChangeAllQuestions: true,
          disableChange: false,
          selectedOptions: {
            classe: "",
            filiere: "",
            matiere: "",
            chapitre: "",
            questions: "",
          },
        }),
      );
      window.localStorage.setItem(
        "questions",
        JSON.stringify(generatedQuestions),
      );
      window.localStorage.setItem("responses", JSON.stringify({}));
      window.localStorage.setItem("corrections", JSON.stringify([]));
      router.push(`/question/1`);
    }
  }, [generatedQuestions, selectedOptions, router]);

  const handleRequestNewQuestions = useCallback(async () => {
    if (
      (canChangeAllQuestions && !disableChange) ||
      (canChangeAllQuestions && numberOfChange === 0)
    ) {
      setLoading(true);
      setCanChangeAllQuestions(false);
      await request();
      setLoading(false);
    }
  }, [canChangeAllQuestions, disableChange, numberOfChange, request]);

  if (loading) {
    return (
      <div className="ShowQuestions_loading">
        <SyncLoader color="#34495E" size={18} />
        <p className="ShowQuestions_loading_text">création</p>
      </div>
    );
  }

  if (generatedQuestions.length === 0) {
    return (
      <div className="ShowQuestions_not_show">
        <p className="ShowQuestions_not_show_text">Vous n&#39;avez pas accès</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Menu />
      <div
        className="w-3/4 bg-[#F3F4F6] flex flex-col border-2 rounded p-8 mx-auto my-16"
        style={{ position: "relative" }}
      >
        <Image
          src={NewQuestions}
          title="changer toutes les questions"
          alt="ce bouton change toutes les questions"
          className={`w-7 ${
            disableChange && numberOfChange !== 0
              ? "opacity-50"
              : canChangeAllQuestions
                ? "cursor-pointer"
                : "opacity-50"
          }`}
          style={{ position: "absolute", right: "15px" }}
          priority
          onClick={handleRequestNewQuestions}
        />
        <h2 className="text-2xl my-7">Liste des questions</h2>
        <p className="text-black mb-5">
          Vous avez la possibilité de changer une ou toutes les questions, si il
          y a des questions qui ne vous plaisent pas.
        </p>
        <hr className="w-4/5 mb-3" />
        <ul>
          {generatedQuestions.map((question: string, index: number) => (
            <li key={index} className="flex items-center my-8">
              <p className="w-full text-black">{question}</p>
              {changingQuestion[index] ? (
                <ClipLoader color="#34495E" size={18} />
              ) : (
                <Image
                  src={Reload}
                  title="changer la question"
                  alt="ce bouton change la question"
                  className={`w-5 ml-5 ${
                    disableChange ? "opacity-50" : "cursor-pointer"
                  }`}
                  priority
                  onClick={() => changeQuestion(question, index)}
                />
              )}
            </li>
          ))}
        </ul>
        <p
          className="text-black text-center my-5"
          title="C'est le nombre de fois que vous pouvez changer une question"
        >
          {numberOfChange}/5
        </p>
        <div className="w-full mt-10 flex justify-center">
          <button
            className={`${
              disableChange && numberOfChange !== 0
                ? "ShowQuestions_button_create_close"
                : "ShowQuestions_button_create"
            } mb-5`}
            onClick={startExam}
            disabled={disableChange && numberOfChange !== 0}
          >
            Commencer
          </button>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default ShowQuestionsFunction;
