import { NextResponse } from "next/server";
import { response } from "../common/route";

export async function POST(request: any) {
    const responses = await request.json();

    const message = await response({role: "user", content: `Result: ${responses.data}`}, responses.choosedPrompt);

    return NextResponse.json({ message });
  }