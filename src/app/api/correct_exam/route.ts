import { NextResponse } from "next/server";
import { response } from "../common/route";

export async function POST(request: any) {
  const responses = await request.json();

  let message;
  try {
      message = await response({role: "user", content: `Result: ${responses.data}`}, responses.choosedPrompt);
  } catch (err) {
      return NextResponse.json({ message: { message: { content: "Erreur lors de la génération de la réponse." }} });
  }

  return NextResponse.json({ message });
}