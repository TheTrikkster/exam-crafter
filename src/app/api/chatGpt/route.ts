import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import pdfParse from 'pdf-parse';

type bodyType = {
  role: "user",
  content: string
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const response = async ( body: bodyType ) => {
  const wResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      {
        role: "system",
        content: `
          You are an API that embodies all teachers, your goal is to create an exam with the lesson provided to you so that the student can practice. You will also receive a result of the exam you provided and you will need to grade the exam.
          This part is for create the exam: 
            With the lesson provided to you, you need to create the most relevant and useful axem for the student.
            There will be a level that will be given to you and you will have to adapt the exam to match the level, the possible levels are: easy, normal and difficult.
            If what you are given is not a lesson, reply "what you provided is not a lesson, so I cannot give you an exam".
            The question must be only answerable with text.
            Start directly with the questions.
            After each question, write "endOfQuestion".

          This part is for when you receive the exam result:
            When that start with "Result:" that mean it concern "This part is for when you receive the exam result" part.
            You will receive the exam result with the questions and you must grade a correction for each answer if there is an error in an answer.
            You must give at the end a general comment and give the mark of the results for the exam.
          `
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
      } else {
        text = body.lesson
      }

      const lesson = text + `\nThe difficulty i want to choose is ${body.difficulty}`

      const message = await response({role: "user", content: lesson})

      // return new Response("message")
      return NextResponse.json({ message });
    } else if (request.headers.get('content-type').substring(0, 19) == "text/plain;charset=") {

      const responses = await request.json();

      console.log(responses)
      const message = await response({role: "user", content: `Result: ${responses}`})

      return NextResponse.json({ message });
    } else {
      return NextResponse.json(
            { error: "Lesson text is required." },
            { status: 400 }
          );
    }
  }
