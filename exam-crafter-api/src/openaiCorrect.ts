import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
// import { OptionsType } from './create_exam/dto/create-create_exam.dto';

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: 'gpt-3.5-turbo-0125',
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
        const correction = await generatedResponse(
          `
            Tu es un professeur qui doit corriger la reponse à une question fournie part un élève.

            La question:
            {question}

            La réponse:
            {response}

            Si la réponse est à fausse ou partiellement juste tu devras fournir la correction adéquat et uniquement la correction sans rien de plus à cette réponse.
            La correction ne doit pas être beaucoup trop long.
          `,
          question,
          responses[index],
        );

        const grade = await generatedResponse(
          `
        Tu es un professeur qui doit noter la reponse à une question fournie part un élève.

        La question:
        {question}

        La réponse:
        {response}

        Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
        Si la réponse n'est pas conforme à la question attribuez 0 point.
        Tu dois retourner uniquement la note (le nombre) et rien d'autre.
      `,
          question,
          responses[index],
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
