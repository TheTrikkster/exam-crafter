import { NextResponse } from 'next/server';
import Topic from '../models/model';
import connectMongoDB from '../mongodb/connectdb';

export async function POST(request: Request) {
  const { id } = await request.json();

  await connectMongoDB();
  const findElement = await Topic.findOne({ _id: id });

  if (!findElement) {
    return NextResponse.json({ status: 'error', message: 'Request not found' });
  }
  if (findElement.status == 'ready') {
    await Topic.deleteOne({ _id: id });

    return NextResponse.json({
      status: findElement.status,
      data: findElement.data
    });
  } else {
    return NextResponse.json({
      status: findElement.status,
      data: findElement.data
    });
  }
}
