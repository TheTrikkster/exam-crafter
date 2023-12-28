import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { response } from "../common/route";
import Topic from "../models/model";
import connectMongoDB from "../mongodb/connectdb";

export async function POST(request: Request) {
  const formData: FormData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = Object.fromEntries(formData);
  let text;

  await connectMongoDB();
  const newTopic = await Topic.create({ status: "pending", data: null });
  const id = newTopic._id.toString();

  if (typeof body.lesson == "object") {
    try {
      const buffer = Buffer.from(await body.lesson.arrayBuffer());
      text = await pdfParse(buffer);
      text = text.text;
    } catch (err) {
      return NextResponse.json({
        message: {
          message: { content: "Erreur lors de la conversion du PDF en texte." },
        },
      });
    }
  } else {
    text = body.lesson;
  }

  try {
    generateQuestionsAsync(text, body.choosedPrompt, id);
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json({
      message: {
        message: { content: "Erreur lors de la génération de la réponse." },
      },
    });
  }
}

async function generateQuestionsAsync(
  text: string,
  choosedPrompt: string,
  id: string,
) {
  let prompt;

  if (choosedPrompt == "check") {
    prompt = `Je voudrais appeler la fonction de verify en lui passant un string.
              Doit être vérifier : ${text}
              A la fin retourne uniquement VALID ou INVALID.`;
  } else {
    prompt = `I would like to call the create exam function passing an array (in the array must be 10 questions) to it.
              Lesson: ${text}
              At the end, return the array to me with the questions.`;
  }

  try {
    const message = await response(prompt);
    await Topic.updateOne(
      { _id: id },
      {
        $set: {
          status: "ready",
          data: message,
        },
      },
    );
  } catch (err) {
    await Topic.updateOne(
      { _id: id },
      {
        $set: {
          status: "error",
          data: null,
        },
      },
    );
  }
}
