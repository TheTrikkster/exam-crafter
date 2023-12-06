"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { QuestionType } from "./[id]/page";
import "./[id]/Question.scss";

export const QuestionFunctions = ({ params }: QuestionType) => {
  const id = Number(params.id);
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [reponseError, setReponseError] = useState<{
    toLong: boolean;
    generation: boolean;
  }>({ toLong: false, generation: false });
  const [correction, setCorrection] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [allResponses, setAllResponses] = useState<Record<number, string>>({});
  let generationError = false;

  useEffect(() => {
    setQuestions(JSON.parse(window.localStorage.getItem("questions") || "[]"));
    setAllResponses(
      JSON.parse(window.localStorage.getItem("responses") || "{}"),
    );
  }, []);

  const sendResponse = () => {
    allResponses[id] = `Response ${id}: ${response}`;
    window.localStorage.setItem("responses", JSON.stringify(allResponses));
  };

  const request = async (
    question: string,
    index: number,
    choosedPrompt: string,
  ) => {
    try {
      const waitResponse = await fetch("/api/correct_exam", {
        method: "POST",
        body:
          choosedPrompt == "comment"
            ? JSON.stringify({
                data: [...questions, ...Object.values(allResponses)],
                choosedPrompt: "comment",
              })
            : JSON.stringify({
                data: [question, allResponses[index + 1]],
                choosedPrompt: choosedPrompt,
              }),
      });

      if (!waitResponse.ok) {
        throw new Error("Erreur dans la réponse");
      }

      const data = await waitResponse.json();

      if (
        data.message.message.content ==
        "Erreur lors de la génération de la réponse."
      ) {
        generationError = true;
      }

      return data.message.message.content;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    const allCorrections = await Promise.all(
      questions.map(async (question: string, index: number) => {
        try {
          const correction = await request(question, index, "response");
          const grade = await request(question, index, "grade");

          return { correction: correction, grade: grade };
        } catch (error) {
          console.error(error);
        }
      }),
    );

    const comment = await request("", 0, "comment");

    if (generationError) {
      setCorrection(false);
      delete allResponses[10];
      window.localStorage.setItem("responses", JSON.stringify(allResponses));
      setReponseError((prevState) => ({ ...prevState, generation: true }));
    } else {
      window.localStorage.setItem("comment", JSON.stringify(comment.trim()));
      window.localStorage.setItem(
        "corrections",
        JSON.stringify(allCorrections),
      );
      router.push(`/result`);
    }
  };

  const confirmOptionChange = () => {
    setShowModal(false);
    window.localStorage.setItem("questions", JSON.stringify([]));
    window.localStorage.setItem("responses", JSON.stringify({}));
    window.localStorage.setItem("comment", JSON.stringify(""));
    window.localStorage.setItem("corrections", JSON.stringify([]));
    router.push(`/drafting`);
  };

  const cancelOptionChange = () => {
    setShowModal(false);
  };

  const handleAnswer = (nextQuestionId: number) => {
    router.push(`/question/${nextQuestionId}`);
  };

  const nextQuestion = () => {
    if (response.length < 10000) {
      if (questions.length == id) {
        setCorrection(true);
        fetchData();
      } else {
        handleAnswer(id + 1);
      }
      sendResponse();
    } else {
      setReponseError((prevState) => ({
        ...prevState,
        toLong: true,
      }));
    }
  };

  if (correction) {
    return (
      <div className="Question_loading_or_do_not_exist">
        <SyncLoader color="#34495E" size={18} />
        <p className="Question_loading_text_or_do_not_exist">correction</p>
      </div>
    );
  }

  if (
    id < 1 ||
    id > questions.length ||
    Object.keys(allResponses).length !== id - 1
  ) {
    return (
      <div className="Question_loading_or_do_not_exist">
        <p className="Question_loading_text_or_do_not_exist">
          {id < 1 || id > questions.length
            ? "Cette page n'existe pas"
            : "Cette page n'est pas disponible"}
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <header>
        {questions.length > 0 ? (
          <h3 className="Question_the_question">{questions[id - 1]}</h3>
        ) : null}
      </header>
      {showModal && (
        <div className="Question_modal">
          <div className="Question_modal_content">
            <p>
              Êtes-vous sûr de vouloir quitter ? <br /> Cela supprimera
              l&#39;examen.
            </p>
            <div className="Question_modal_buttons">
              <button onClick={confirmOptionChange}>Confirmer</button>
              <button onClick={cancelOptionChange}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      <main className="Question_main">
        {reponseError.toLong || reponseError.generation ? (
          <p className="Question_reponse_to_long">
            {reponseError.toLong
              ? "Votre réponse est beaucoup trop longue"
              : "Erreur lors de la génération de la correction"}
          </p>
        ) : null}
        <textarea
          style={{ resize: "none", caretColor: "auto" }}
          className="Question_response_field"
          value={response}
          placeholder="Vous devez écrire votre réponse ici"
          onChange={(event: { target: { value: string } }) =>
            setResponse(event.target.value)
          }
        />
        <div className="Question_button_container">
          <button
            className="Question_button"
            onClick={nextQuestion}
            disabled={response.length > 0 ? false : true}
          >
            prochaine question
          </button>
          <button
            className="Question_boutton_quittez"
            onClick={() => setShowModal(true)}
          >
            quittez
          </button>
        </div>
      </main>
    </Fragment>
  );
};
