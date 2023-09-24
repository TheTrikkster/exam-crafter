import { Configuration, OpenAIApi } from "openai";

type bodyType = {
  role: "user",
  content: string,
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY 
})

const openai = new OpenAIApi(configuration)

export const response = async ( body: bodyType, choosedPrompt: string ) => {
  let prompt;

  if(choosedPrompt == "lesson") {
    prompt = `
    Tu dois créer dix questions sur le sujet qui te sera fourni. Le sujet doit obligatoirement concerner la pédagogie.  Si le sujet ne peut pas servir pour créer dix questions ou s'il n'est pas clair, alors tu répondra par "INVALID" sinon crée les 10 question en les séparant par le mot "endOfQuestion".
    `
  } if (choosedPrompt == "comment") {
    prompt = `
      Tu es un professeur qui doit commenter la copie de l'examen d'un élève.
      Une copie d'un examen te sera fournie. Ta tâche sera d'analyser en détail chacune des questions et des réponses fournies dans cette copie. Suite à cette analyse, te devras fournir un commentaire général qui évalue l'examen dans son ensemble.      
      Le commentaire doit être pertinent et doit aider l’élève à avancer.
      Afficher uniquement le commentaire général et rien d'autere. 
      Le commentaire ne doit pas être très long.
    `
  } if(choosedPrompt == "grade") {
    prompt = `
      Tu es un professeur qui doit attribuer une note la réponse à la question d’un élève.
      Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
      Si la réponse n'est pas conforme à la question attribuez 0 point.
      Afiicher uniquement le nombre du resultat et rien d'autre.
    `
  } if (choosedPrompt == "response") {
    prompt = `
      Tu es un professeur qui doit corriger la réponse à la question d’un élève.
      Si la réponse est à fausse ou partiellement juste tu devras fournir la correction et uniquement la correction sans rien de plus à cette réponse, .
      La correction ne devras pas être beaucoup trop long.
    `
  }

  try {
  const wResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      {
        role: "system",
        content: prompt
      },
      body,
    ]
    });

  return wResponse.data.choices[0];
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};