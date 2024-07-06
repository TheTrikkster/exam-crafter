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
        const correction = await generatedResponse(
          `
            Tu es un professeur qui doit corriger la reponse à une question fournie part un élève.

            La question:
            {question}

            La réponse de l'élève:
            {response}

            Si la réponse est à fausse ou partiellement juste tu devras fournir la correction adéquat et uniquement la correction sans rien de plus à cette réponse.
            La correction ne doit pas être trop longue.
          `,
          question,
          responses[++index],
        );

        const grade = await generatedResponse(
          `
          Tu es un professeur qui doit noter la reponse à une question fournie par un élève.

          La question:
          {question}

          La réponse de l'élève:
          {response}

          Tu dois attribuer une note à la réponse de l'élève mais ne sois pas très strict et faites attention au sens de la réponse car il est possible qu'elle ne soit pas parfaitement précise.
          L'évaluation se fera de la manière suivante : 1 point pour une bonne réponse, 0,5 pour une réponse partiellement correcte, et 0 pour une fausse réponse.
          Fait très attention à cette règle, tu dois retourner uniquement la note (le nombre) et rien d'autre.
          Retourner uniqument le nombre et rien d'autre.
        `,
          question,
          responses[++index],
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
