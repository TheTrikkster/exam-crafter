import { NextResponse, NextRequest } from "next/server";
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
            You are an API that embodies all teachers, your goal is to create an exam with the lesson provided to you so that the student can practice.
            With the lesson provided to you, you need to create the most relevant and useful axem for the student.
            There will be a level that will be given to you and you will have to adapt the exam to match the level, the possible levels are: easy, normal and difficult.
            Only the lesson can be accepted and if what you are given is not a lesson, answer "Ce que vous avez fourni n'est pas une leçon, donc je ne peux pas vous donner d'examen".
            The question must be only answerable with text.
            Start directly with the questions.
            After each question, write "endOfQuestion".
          `
  } else {
    prompt = `
            You are an API who embodies all teachers, you will receive the exam made by someone and your goal is to evaluate it.
            You will receive the exam result with the questions and you will have to correct the answer to each question if there is an error.
            Start directly with the corrections.
            Before and after each question, write "endAndStartOfQuestion".
            You should give a general comment at the end and give a grade to the exam result.
            Before the general comment write "startOfComment".
          `
  }

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

      const lesson =  `${text} \nThe difficulty i want to choose is ${body.difficulty}`

      const message = await response({role: "user", content: lesson}, "lesson")

      // return new Response("message")
      return NextResponse.json({ message });
    } else if (request.headers.get('content-type').substring(0, 19) == "text/plain;charset=") {

      const responses = await request.json();

      const message = await response({role: "user", content: `Result: ${responses}`})

      return NextResponse.json({ message });
    } else {
      return NextResponse.json(
            { error: "Lesson text is required." },
            { status: 400 }
          );
    }
  }
