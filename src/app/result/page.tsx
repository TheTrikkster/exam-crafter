import "./Result.scss";
import { ResultFunctions } from "./functions";
import Head from '@/components/head/Head';


function Result() {
  return ( 
    <>
     <Head
      title="Résultats et corrections de votre examen - Analyse par Exeam Crafter IA"
      description="Consultez le résultat de votre examen, y compris les corrections, les commentaires et la note finale."
      keywords="résultat, examen, correction, commentaire, note" />
    <ResultFunctions />

    </> 
  )
}

export default Result;