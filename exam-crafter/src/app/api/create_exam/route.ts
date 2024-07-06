// import { NextResponse } from "next/server";
// import pdfParse from "pdf-parse";
// import { response } from "../common/route";
// import Topic from "../models/model";
// import connectMongoDB from "../mongodb/connectdb";

// export async function POST(request: Request) {
// const formData = request;
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const body: any = Object.fromEntries(formData);
// let text;
// await connectMongoDB();
// const newTopic = await Topic.create({ status: "pending", data: null });
// const id = newTopic._id.toString();
// if (typeof body.lesson == "object") {
//   try {
//     const buffer = Buffer.from(await body.lesson.arrayBuffer());
//     text = await pdfParse(buffer);
//     text = text.text;
//     if (text.length > 10000) {
//       return NextResponse.json({
//         error: "Le contenu fourni est trop volumineux",
//       });
//     } else if (text.length < 30) {
//       return NextResponse.json({
//         error: "Le contenu fourni est trop court",
//       });
//     }
//   } catch (err) {
//     return NextResponse.json({
//       error: "Erreur lors de la conversion du PDF en texte.",
//     });
//   }
// } else {
//   text = body.lesson;
// }
//   try {
//     const message = await response(formData);
//     // generateQuestionsAsync(text, body.choosedPrompt, id);
//     return NextResponse.json({ message });
//   } catch (err) {
//     return NextResponse.json({
//       error: "Erreur lors de la génération de la réponse.",
//     });
//   }
// }
// async function generateQuestionsAsync(
//   text: string,
//   choosedPrompt: string,
//   id: string,
// ) {
//   let prompt;
//   if (choosedPrompt == "check") {
//     prompt = `Je voudrais appeler la fonction de verify en lui passant un string.
//               Doit être vérifier : ${text}
//               A la fin retourne uniquement VALID ou INVALID.`;
//   } else {
//     prompt = `I would like to call the create exam function passing an array (in the array must be 10 questions) to it.
//               Lesson: ${text}
//               At the end, return the array to me with the questions.`;
//   }
//   try {
//     const message = await response(prompt);
//     await Topic.updateOne(
//       { _id: id },
//       {
//         $set: {
//           status: "ready",
//           data: message,
//         },
//       },
//     );
//   } catch (err) {
//     await Topic.updateOne(
//       { _id: id },
//       {
//         $set: {
//           status: "error",
//           data: null,
//         },
//       },
//     );
//   }
// }

import { NextApiResponse } from 'next';
import { response } from '../common/reponse';

// Fonction pour gérer les requêtes API
export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const result = await response();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Gérer les autres méthodes HTTP, par exemple GET, PUT, DELETE, etc.
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
