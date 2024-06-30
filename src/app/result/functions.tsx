"use client";
import React, { Fragment, useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Menu from "@/components/menu/Menu";

export const ResultFunctions = () => {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<
    { correction: string; grade: string }[]
  >([]);
  const [examUnfinished, setExamUnfinished] = useState<boolean>(false);
  const [grade, setGrade] = useState<number>(0);

  useEffect(() => {
    try {
      const allQuestions = JSON.parse(
        window.localStorage.getItem("questions") || "[]",
      );
      const allResponses = JSON.parse(
        window.localStorage.getItem("responses") || "{}",
      );
      const allCorrections = JSON.parse(
        window.localStorage.getItem("corrections") || "[]",
      );

      setExamUnfinished(allCorrections.length === 0);

      if (allQuestions.length > 0) {
        setQuestions(allQuestions);
        setResponses(allResponses);
        setCorrections(allCorrections);
        const totalGrade = allCorrections.reduce(
          (sum: number, current: { grade: string }) =>
            sum + Number(current.grade),
          0,
        );
        setGrade(totalGrade);
      }
    } catch (error) {
      console.error("Error parsing data from local storage:", error);
    }
  }, []);

  if (examUnfinished) {
    return (
      <div className="Result_not_show">
        <p className="Result_not_show_text">Vous n&#39;avez pas accès</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Menu />
      <div className="Result_container">
        <header>
          <h1 className="Result_title text-3xl">Correction</h1>
        </header>
        <main>
          <div className="Result_corrections_container">
            <p
              className={`Result_grade ${
                grade < 0.4 * questions.length
                  ? "Result_grade_red"
                  : grade >= 0.4 * questions.length &&
                      grade < 0.7 * questions.length
                    ? "Result_grade_orange"
                    : "Result_grade_green"
              }`}
            >
              Note: {grade}/{questions.length}
            </p>
            {questions.map((question: string, index: number) => (
              <div key={index} className="Result_each_Result_container">
                <h2 className="mb-1 text-lg">Question n° {index + 1}</h2>
                <h3 className="Result_question text-lg font-medium">
                  {question}
                </h3>
                <p className="Result_response">{responses[index + 1]}</p>
                <p className="Result_correction">
                  {corrections[index]?.correction}
                </p>
                {questions.length !== index + 1 && (
                  <hr className="h-0.5 bg-slate-300 mt-12" />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </Fragment>
  );
};
