import { Fragment } from "react";
import "./Result.scss";
import { ResultFunctions } from "./functions";
import Head from "@/components/head/Head";

function Result() {
  return (
    <Fragment>
      <Head
        title="Résultats et corrections de votre examen - Analyser par Exam Crafter IA"
        description="Consultez le résultat de votre examen, y compris les corrections, les commentaires et la note finale."
        keywords="résultat, examen, correction, commentaire, note"
      />
      <ResultFunctions />
    </Fragment>
  );
}

export default Result;
