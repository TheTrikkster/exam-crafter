import { NextResponse } from "next/server";
import { response } from "../common/route";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: any) {
  const responses = await request.json();

  try {
    const message = await response(
      { role: "user", content: `Result: ${responses.data}` },
      responses.choosedPrompt,
    );
    return NextResponse.json({ message });
  } catch (err) {
    return NextResponse.json({
      message: {
        message: { content: "Erreur lors de la génération de la réponse." },
      },
    });
  }
}
