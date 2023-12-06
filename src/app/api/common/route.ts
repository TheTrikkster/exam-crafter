import { Configuration, OpenAIApi } from "openai";

type bodyType = {
  role: "user";
  content: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const response = async (body: bodyType, choosedPrompt: string) => {
  let prompt;
  switch (choosedPrompt) {
    case "check":
      prompt = `
        En tant que professeur spécialisé en pédagogie, tu as pour tâche d'analyser un texte pour déterminer s'il peut servir de base à un examen pour tes élèves. Pour cela, le texte doit présenter les caractéristiques d'une leçon structurée.
        Une leçon authentique devrait posséder:
          1. Une structure claire et organisée, avec éventuellement des titres ou des sous-titres.
          2. Des informations pédagogiques pertinentes et cohérentes sur un sujet spécifique.
          3. Une progression logique des idées permettant une compréhension aisée.
        Selon ces critères, le texte qui est fournie en dessous est-il une leçon adaptée à la création d'un examen? 
        Si non, répondez par: "INVALID".
      `;
      break;
    case "lesson":
      prompt = `
        Tu es un professeur qui doit créer un examen de 10 questions pour tes élèves.
        Afin de créer ce test tu devras te basé sur le dernier cours que tu as donner à tes élèves.
        La question doit être formulée de telle manière que seule une réponse textuelle soit appropriée.
        Les questions doivent évaluer la compréhension générale du sujet sans se référer ni dépendre d'un élément, exemple ou cas particulier de la leçon. Les questions doivent pouvoir être répondue en se basant uniquement sur l'ensemble du contenu général et non sur des détails spécifiques.
        Commencez directement par les questions.
        Chacune de tes 10 questions doit commencé par « Question nombre: » avec le bon nombre.
        Après chaque question écris « endOfQuestion ».
      `;
      break;
    case "comment":
      prompt = `
        Tu es un professeur qui doit commenter la copie de l'examen d'un élève.
        Une copie d'un examen te sera fournie. Ta tâche sera d'analyser en détail chacune des questions et des réponses fournies dans cette copie. Suite à cette analyse, te devras fournir un commentaire général qui évalue l'examen dans son ensemble.      
        Le commentaire doit être pertinent et doit aider l’élève à avancer.
        Afficher uniquement le commentaire général et rien d'autere. 
        Le commentaire ne doit pas être très long.
      `;
      break;
    case "grade":
      prompt = `
        Tu es un professeur qui doit attribuer une note la réponse à la question d’un élève.
        Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
        Si la réponse n'est pas conforme à la question attribuez 0 point.
        Afiicher uniquement le nombre du resultat et rien d'autre.
      `;
      break;
    case "response":
      prompt = `
        Tu es un professeur qui doit corriger la réponse à la question d’un élève.
        Si la réponse est à fausse ou partiellement juste tu devras fournir la correction et uniquement la correction sans rien de plus à cette réponse, .
        La correction ne devras pas être beaucoup trop long.
      `;
      break;
    default:
      break;
  }

  try {
    const wResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k-0613",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        body,
      ],
    });

    return wResponse.data.choices[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
