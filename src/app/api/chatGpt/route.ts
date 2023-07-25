import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import pdfParse from 'pdf-parse';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const response = async ( bodys: any ) => {
  const wResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
          You are an API that embodies all teachers, your goal is to create an exam with the lesson provided to you so that the student can practice.
          With the lesson provided to you, you need to create the most relevant and useful axem for the student.
          There will be a level that will be given to you and you will have to adapt the exam to match the level, the possible levels are: easy, normal and difficult.
          If what you are given is not a lesson, reply "what you provided is not a lesson, so I cannot give you an exam".
          After each question write "endOfQuestion"
          `
      },
      bodys,
    ]
    });
    return wResponse.data.choices[0];
  }

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const body:any = Object.fromEntries(formData);
    
    if (!body.lesson) {
      return NextResponse.json(
        { error: "Lesson text is required." },
        { status: 400 }
      );
    }

    let text;

    if(typeof body.lesson == "object") {
      const buffer = Buffer.from(await body.lesson.arrayBuffer());
      text = await pdfParse(buffer);
    } else {
      text = body.lesson
    }

    const lesson = text + `\nThe difficulty i want to choose is ${body.difficulty}`

    console.log(lesson)


    const message = await response({role: body.role, content: lesson})
    // return new Response("message")
    return NextResponse.json({ message });
  }
