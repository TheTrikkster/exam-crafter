import React, { Fragment } from "react";
import ShowQuestionsFunction from "./functions";
import Head from "@/components/head/Head";

function ShowQuestions() {
  return (
    <Fragment>
      <Head
        title="Créez votre examen sur mesure avec Exam Crafter | Génération par IA à partir de vos choix"
        description="Personnalisez votre examen avec Exam Crafter. Fournissez une leçon et laissez l'IA créer un examen sur mesure pour une préparation optimale."
        keywords="créer examen, examen sur mesure, IA, personnalisation, leçon, étude, préparation examen"
      />
      <ShowQuestionsFunction />
    </Fragment>
  );
}

export default ShowQuestions;
