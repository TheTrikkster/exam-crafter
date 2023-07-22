import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";
// import multer from "multer"
// const pdfParse = require('pdf-parse');
import { promises as fs } from 'fs';
import formidable, { Files, Fields, File } from 'formidable';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
          `
      },
      ...bodys,
    ]
    });
    return wResponse.data.choices[0];
  }

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    console.log(request)
    console.log(formData)
    console.log(body)
    // const message:any = await response(body)
    // return new Response("message")
    return NextResponse.json({ hello: "world" });
  }
