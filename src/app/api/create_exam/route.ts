import { NextResponse } from "next/server";
import pdfParse from 'pdf-parse';
import { response } from "../common/route";

export async function POST(request: any) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  let text;

  if(typeof body.lesson == "object") {
      try {
          const buffer = Buffer.from(await body.lesson.arrayBuffer());
          text = await pdfParse(buffer);
          text = text.text;
      } catch (err) {
          return NextResponse.json({ message: { message: { content: "Erreur lors de la conversion du PDF en texte." }} });
      }
  } else {
      text = body.lesson;
  }

  if(text.length < 30) {
      return NextResponse.json({ message: { message: { content: "Le contenu fourni est trop court" }} });
  } else if(text.length < 10000) {
      let message;
      try {
          message = await response({role: "user", content: `Voici le sujet: \n${text}`}, body.choosedPrompt);
      } catch (err) {
          return NextResponse.json({ message: { message: { content: "Erreur lors de la génération de la réponse." }} });
      }

      return NextResponse.json({ message });
  } else {
      return NextResponse.json({ message: { message: { content: "Le contenu fourni est trop volumineux" }} });
  }
}