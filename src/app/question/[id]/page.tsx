import "./Question.scss";
import Head from '@/components/head/Head';
import { QuestionFunctions } from '../functions';

export type QuestionType = {
  params: {id: string}
}

function Question({params}: QuestionType) {

  return (
      <div className='question_container'>
        <Head
          title="Répondez à la question d'examen - Généré par Exeam Crafter IA"
          description="Répondez à la question pour progresser dans l'examen. Chaque réponse est importante pour votre évaluation finale."
          keywords="examen, question, IA, examen personnalisé" />
        <QuestionFunctions params={params}/>
      </div>
    )
}

export default Question;