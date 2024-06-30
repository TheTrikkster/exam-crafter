import "./Drafting.scss";
import Head from "@/components/head/Head";
import { DraftingFunctions } from "./functions";
import { Fragment } from "react";

function Drafting() {
  return (
    <Fragment>
      <Head
        title="Créez votre examen sur mesure avec Exam Crafter | Génération par IA à partir de votre leçon"
        description="Personnalisez votre examen avec Exam Crafter. Fournissez une leçon et laissez l'IA créer un examen sur mesure pour une préparation optimale."
        keywords="créer examen, examen sur mesure, IA, personnalisation, leçon, étude, préparation examen"
      />
      <DraftingFunctions />
    </Fragment>
  );
}

export default Drafting;
