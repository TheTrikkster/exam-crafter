import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
// import { OptionsType } from './create_exam/dto/create-create_exam.dto';

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: 'gpt-4-turbo',
});

const generatedResponse = async (
  templateString: string,
  question: string,
  response: string,
) => {
  const prompt = PromptTemplate.fromTemplate(templateString);
  const chain = prompt.pipe(openai).pipe(new StringOutputParser());
  const result = await chain.invoke({
    question,
    response,
  });

  return result;
};

export const GeneratedCorrection = async ({ questions, responses }) => {
  try {
    const correctionAndGrade = await Promise.all(
      questions.map(async (question: string, index: number) => {
        const response = responses[index + 1];
        const correction = await generatedResponse(
          `
            Tu es un professeur qui doit évaluer la réponse à une question fournie par un élève.

            La question:
            {question}

            La réponse de l'élève:
            {response}

            Évalue la réponse en considérant les éléments suivants:
            - Si la réponse est complètement correcte, dit sa justesse ont une ligne.
            - Si la réponse est partiellement juste, indique les points justes et complète avec les détails manquants ou les corrections nécessaires mais en seulement quelques phrases.
            - Si la réponse est incorrecte, fournis la correction appropriée en expliquant brièvement ce qui est erroné.

            La correction ou le commentaire doit être précis mais concis, visant à fournir une explication complète en quelques phrases seulement.
            La correction ne doit pas être longue.
          `,
          question,
          response,
        );

        const grade = await generatedResponse(
          `
            Tu es un professeur qui doit noter la réponse à une question fournie par un élève.

            La question:
            {question}

            La réponse de l'élève:
            {response}

            Suis ces instructions pour attribuer la note :
            - Accorde 1 point si la réponse est globalement correcte, même si elle n'est pas parfaitement précise ou complète. Par exemple, si la question est de définir un concept et que l'élève donne la définition principale correctement mais manque certains détails.
            - Accorde 0,5 point si la réponse est partiellement correcte, c'est-à-dire qu'elle contient des éléments corrects mais omet des informations clés ou comprend des erreurs qui ne changent pas entièrement la validité de la réponse. Par exemple, si l'élève répond correctement à une partie de la question mais ignore une autre partie significative.
            - Accorde 0 point si la réponse est globalement incorrecte ou si elle ne répond pas du tout à la question posée.

            Attention retourne uniquement le nombre attribué et rien d'autre.
          `,
          question,
          response,
        );

        return { correction, grade };
      }),
    );

    return correctionAndGrade;
  } catch (error: any) {
    console.error('Erreur lors de la requête OpenAI:', error.message);
    throw error;
  }
};
