import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import pdfParse from 'pdf-parse';

type bodyType = {
  role: "user",
  content: string,
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const response = async ( body: bodyType, choosedPrompt?: string ) => {

  let prompt;

  if(choosedPrompt == "lesson") {
    prompt = `
      Tu es un professeur qui doit créer un examen de 10 questions pour tes élèves.
      Afin de créer ce test tu devras te basé sur le dernier cours que tu as donner à tes élèves.
      Il y aura un niveau qui te sera donné et tu devras adapter l'examen en fonction du niveau, les niveaux possibles sont : facile, normal et difficile.
      Seul la leçon peut être accepté et si ce qu'on vous donne n'est pas une leçon, répondez "Ce que vous avez fourni n'est pas une leçon, vous ne pouvez donc pas créer un examen.".
      La question doit être formulée de telle manière que seule une réponse textuelle soit appropriée.
      Les questions doivent évaluer la compréhension générale du sujet sans se référer ni dépendre d'un élément, exemple ou cas particulier de la leçon. Les questions doivent pouvoir être répondue en se basant uniquement sur l'ensemble du contenu général et non sur des détails spécifiques.
      Commencez directement par les questions.
      Chacune de tes 10 questions doit commencé par « Question nombre: » avec le bon nombre.
      Avant et après chaque question écris « startEndOfQuestion ».
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

  // Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
  // Si la réponse n'est pas conforme à la question, indiquez la bonne réponse dans la correction et attribuez 0 point.
  // Avant d'afficher la note finale, il est nécessaire d'écrire d'abord 'startEndOfGrade', puis ensuite la note peut être affichée.

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
}

export async function POST(request: any) {
    if (request.headers.get('content-type').substring(0, 19) == "multipart/form-data") {
      const formData = await request.formData();
      const body = Object.fromEntries(formData);
      let text;

      if(typeof body.lesson == "object") {
        const buffer = Buffer.from(await body.lesson.arrayBuffer());
        text = await pdfParse(buffer);
        text = text.text;
      } else {
        text = body.lesson
      }

      const lesson =  `Voici le cours sur lequel tu dois te basé: \n${text} \nLa difficulté choisie est ${body.difficulty}.`;

      const message = await response({role: "user", content: lesson}, "lesson");

      // return new Response("message")
      return NextResponse.json({ message });
    } else if (request.headers.get('content-type').substring(0, 19) == "text/plain;charset=") {

      const responses = await request.json();

      let message;

        message = await response({role: "user", content: `Result: ${responses.data}`}, responses.choosedPrompt);

      return NextResponse.json({ message });
    } else {
      return NextResponse.json(
            { error: "Lesson text is required." },
            { status: 400 }
          );
    }
  }
