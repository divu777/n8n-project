import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // or 'edge' if you want edge streaming

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 5; i++) {
        const chunk = `Chunk ${i + 1}\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise(r => setTimeout(r, 1000)); // simulate delay
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
