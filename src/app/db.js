import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const response = async ( bodys ) => {
  const wResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: ``
      },
      ...bodys,
    ]
    });
    return wResponse.data.choices[0];
  }

export default async function Handler(req, res) {
  try {
    const { body } = req;
    const message = await response(body)
    res.status(200).json({
      role: 'assistant',
      content: message.message.content
    })
  }catch(err) {
    console.error(err)
  }
}
