"use client";
import React, { Fragment, useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Menu from "@/components/menu/Menu";

export const ResultFunctions = () => {
  const [responses, setResponses] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<
    { text: string; grade: string }[]
  >([]);
  const [comment, setComment] = useState<string>("");
  const [examUnfinished, setExamUnfinished] = useState<boolean>(false);
  const [noQuestion, setNoQuestion] = useState<boolean>(false);
  const [grade, setGrade] = useState<number>(0);

  useEffect(() => {
    try {
      const isBrowser = typeof window !== "undefined";
      const allQuestions = isBrowser
        ? JSON.parse(window.localStorage.getItem("questions") || "[]")
        : [];
      const allResponses = isBrowser
        ? JSON.parse(window.localStorage.getItem("responses") || "{}")
        : {};
      const theComment = isBrowser
        ? JSON.parse(window.localStorage.getItem("comment") || '""')
        : "";
      const allCorrections = isBrowser
        ? JSON.parse(window.localStorage.getItem("corrections") || "[]")
        : [];

      setNoQuestion(allQuestions.length === 0);
      setExamUnfinished(allCorrections.length < 10);

      if (allQuestions.length > 0) {
        setQuestions(allQuestions);
        setResponses(allResponses);
        setComment(theComment.comment);
        setCorrections(allCorrections);
        const totalGrade = allCorrections.reduce(
          (sum: number, current: { text: string; grade: string }) =>
            sum + Number(current.grade),
          0,
        );
        setGrade(totalGrade);
      }
    } catch (error) {
      console.error("Error parsing data from local storage:", error);
    }
  }, []);

  if (noQuestion || examUnfinished || !comment) {
    return (
      <div className="Result_not_show">
        <p className="Result_not_show_text">
          {noQuestion
            ? "Vous devez d'abord créer l'examen"
            : examUnfinished
              ? "Vous devez finir l'examen"
              : "Une erreur est survenue"}
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <Menu />
      <div className="Result_container">
        <header>
          <h1 className="Result_title">Correction</h1>
        </header>
        <main>
          <p
            className={`Result_grade ${
              grade < 4
                ? "Result_grade_red"
                : grade >= 4 && grade < 7
                  ? "Result_grade_orange"
                  : "Result_grade_green"
            }`}
          >
            Note: {grade}/10
          </p>
          <div className="Result_corrections_container">
            {questions.map((question: string, index: number) => {
              const reponse = responses[index + 1].slice(11);

              return (
                <div key={index} className="Result_each_Result_container">
                  <h3 className="Result_question">{question}</h3>
                  <p className="Result_response">{reponse}</p>
                  <p className="Result_correction">{corrections[index].text}</p>
                </div>
              );
            })}
          </div>

          <hr className="Result_separate_correction_and_comment" />

          <div className="Result_comment_grade_container">
            <h2 className="Result_comment_title">Commentaire:</h2>
            <p className="Result_comment">{comment}</p>
          </div>
        </main>
      </div>
      <Footer />
    </Fragment>
  );
};
