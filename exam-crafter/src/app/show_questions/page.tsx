import React, { Fragment } from "react";
import ShowQuestionsFunction from "./functions";
import Head from "@/components/head/Head";

function ShowQuestions() {
  return (
    <Fragment>
      <Head
        title="Modifiez les questions de votre examen sur mesure générées par l'IA"
        description="Personnalisez votre examen avec Exam Crafter. Changez les questions grâce à l'IA."
        keywords="créer examen, examen sur mesure, IA, personnalisation, questions, étude, changer les questions"
      />
      <ShowQuestionsFunction />
    </Fragment>
  );
}

export default ShowQuestions;
