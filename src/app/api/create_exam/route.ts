import { NextResponse } from "next/server";
import pdfParse from 'pdf-parse';
import { response } from "../common/route";

export async function POST(request: any) {
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
    if(text.length < 30) {
      return NextResponse.json({ message: {message: {content: "Le contenu fourni est trop court"}} });
    } else if(text.length < 10000) {
      const lesson =  `Voici le sujet: \n${text}`;

      const message = await response({role: "user", content: lesson}, body.choosedPrompt);

      return NextResponse.json({ message });
    } else {
      return NextResponse.json({ message: {message: {content: "Le contenu fourni est trop volumineux"}} });
    }
  }