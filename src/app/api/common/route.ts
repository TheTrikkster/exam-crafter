import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const verify = (verified: string) => {
  const result = verified;
  return result;
};

const createExam = (questions: string[]) => {
  const result = questions;
  return result;
};

const correction = (text: string, grade: string) => {
  const result = { text, grade };
  return result;
};

const comment = (comment: string) => {
  const result = { comment };
  return result;
};

export const response = async (prompt: string) => {
  const functionCalling = (
    name: string,
    description: string,
    properties: object,
    require: string[],
  ) => {
    return {
      name,
      description,
      parameters: {
        type: "object",
        properties,
        require,
      },
    };
  };

  const chat = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content: prompt }],
    functions: [
      functionCalling(
        "verify",
        "Vérifiez si c'est une leçon ou non et renvoyez INVALID ou VALID",
        {
          verified: {
            type: "string",
            description: `Tu es un professeur spécialisé en pédagogie, tu as pour tâche d'analyser un texte pour déterminer s'il peut servir de base à un examen pour tes élèves. Pour cela, le texte doit présenter les caractéristiques d'une leçon structurée.
                        Une leçon authentique devrait posséder:
                          1. Une structure claire et organisée, avec éventuellement des titres ou des sous-titres.
                          2. Des informations pédagogiques pertinentes et cohérentes sur un sujet spécifique.
                          3. Une progression logique des idées permettant une compréhension aisée.
                        Selon ces critères, le texte qui est fournie est-il une leçon adaptée à la création d'un examen ?
                        Si c'est un cours le string doit être égal à VALID sinon INVALID`,
          },
        },
        ["verified"],
      ),
      functionCalling(
        "createExam",
        "Print an array of string with questions passed to it",
        {
          questions: {
            type: "string",
            description: `Tu es un professeur qui doit créer un examen de 10 questions pour tes élèves.
                          Afin de créer ce test tu devras te basé sur le dernier cours que tu as donner à tes élèves.
                          La question doit être formulée de telle manière que seule une réponse textuelle soit appropriée.
                          Les questions doivent évaluer la compréhension générale du sujet sans se référer ni dépendre d'un élément, exemple ou cas particulier de la leçon. Les questions doivent pouvoir être répondue en se basant uniquement sur l'ensemble du contenu général et non sur des détails spécifiques.`,
          },
        },
        ["questions"],
      ),
      functionCalling(
        "correction",
        "imprimer la correction en lui passant un object qui contient deux string",
        {
          text: {
            type: "string",
            description: `Tu es un professeur qui doit corriger la réponse à la question d’un élève.
                          Si la réponse est à fausse ou partiellement juste tu devras fournir la correction et uniquement la correction sans rien de plus à cette réponse, .
                          La correction ne devras pas être beaucoup trop long.`,
          },
          grade: {
            type: "string",
            description: `Tu es un professeur qui doit attribuer une note la réponse à la question d’un élève.
                          Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
                          Si la réponse n'est pas conforme à la question attribuez 0 point.
                          Afiicher uniquement le nombre du resultat et rien d'autre.`,
          },
        },
        ["text", "grade"],
      ),
      functionCalling(
        "comment",
        "imprimer le comment avec une chaîne qui lui a été passée",
        {
          comment: {
            type: "string",
            description: `Tu es un professeur qui doit commenter la copie de l'examen d'un élève.
                          Une copie d'un examen te sera fournie. Ta tâche sera d'analyser en détail chacune des questions et des réponses fournies dans cette copie. Suite à cette analyse, te devras fournir un commentaire général qui évalue l'examen dans son ensemble.
                          Le commentaire doit être pertinent et doit aider l’élève à avancer.
                          Afficher uniquement le commentaire général et rien d'autre.
                          Le commentaire ne doit pas être très long.`,
          },
        },
        ["comment"],
      ),
    ],
    function_call: "auto",
  });

  const wantsToUseFunction =
    chat.data.choices[0].finish_reason == "function_call";
  const fucntionNames = ["verify", "createExam", "correction", "comment"];
  let content;

  if (wantsToUseFunction) {
    if (
      fucntionNames.includes(
        chat.data.choices[0].message?.function_call?.name
          ? chat.data.choices[0].message?.function_call?.name
          : "false",
      ) &&
      chat.data.choices[0].message?.function_call?.arguments
    ) {
      const argumentOgj = JSON.parse(
        chat.data.choices[0].message?.function_call.arguments,
      );

      switch (chat.data.choices[0].message?.function_call?.name) {
        case "verify":
          content = verify(argumentOgj.verified);
          break;
        case "createExam":
          content = createExam(argumentOgj.questions);
          break;
        case "correction":
          content = correction(argumentOgj.text, argumentOgj.grade);
          break;
        case "comment":
          content = comment(argumentOgj.comment);
      }
    }
  }

  return content;
};
