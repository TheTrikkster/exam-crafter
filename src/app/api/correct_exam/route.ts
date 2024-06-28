// import { NextResponse } from "next/server";
// import { response } from "../common/route";
// import Topic from "../models/model";
// import connectMongoDB from "../mongodb/connectdb";

// export async function POST(request: Request) {
// const data = await request.json();
// await connectMongoDB();
//   try {
//     const ids = [];
//     for (let i = 0; i < 10; i++) {
//       const newTopic = await Topic.create({
//         status: "pending",
//         data: null,
//       });
//       ids.push(newTopic._id.toString());
//     }
//     generateCorrectionAsync(ids, data);
//     const newTopic = await Topic.create({ status: "pending", data: null });
//     const id = newTopic._id.toString();
//     ids.push(id);
//     generateCorrectionAsync(id, data.comment);
//     return NextResponse.json({ ids });
//   } catch (error) {
//     console.error(error);
//   }
// }
// async function generateCorrectionAsync(
//   id: string[] | string,
//   questionsAndResponses:
//     | {
//         questions: string[];
//         responses: { [key: string]: string };
//       }
//     | string[],
// ) {
//   let prompt;
//   const AIRequest = async (id: string, prompt: string) => {
//     try {
//       const message = await response(prompt);
//       await Topic.updateOne(
//         { _id: id },
//         {
//           $set: {
//             status: "ready",
//             data: message,
//           },
//         },
//       );
//     } catch (err) {
//       console.error(err);
//       await Topic.updateOne(
//         { _id: id },
//         {
//           $set: {
//             status: "error",
//             data: null,
//           },
//         },
//       );
//     }
//   };
//   if (Array.isArray(questionsAndResponses)) {
//     prompt = `Je voudrais appeler la fonction de comment en lui passant un string.
//     Questions et Responses: ${questionsAndResponses}
//     A la fin, retourne un string`;
//     if (typeof id === "string") {
//       AIRequest(id, prompt);
//     }
//   } else {
//     await Promise.all(
//       questionsAndResponses.questions.map(
//         async (question: string, index: number) => {
//           prompt = `Je voudrais appeler la fonction de correction en lui passant un object.
//               Tu dois corrriger la réponse si elle est incomplète ou fausse.
//               Voici la question et la réponse :
//               Question: ${question}
//               ${questionsAndResponses.responses[index + 1]}
//               A la fin, retourne un object avec deux string à l'intérieur qui représente la correction et la note`;
//           AIRequest(id[index], prompt);
//         },
//       ),
//     );
//   }
// }

import { NextApiResponse } from "next";
import { response } from "../common/reponse";

// Fonction pour gérer les requêtes API
export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const result = await response();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Gérer les autres méthodes HTTP, par exemple GET, PUT, DELETE, etc.
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
