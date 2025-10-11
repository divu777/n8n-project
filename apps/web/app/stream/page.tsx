'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch('/api/stream');
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          console.log(decoder.decode(value));
        }
        done = readerDone;
      }
    };

    fetchStream();
  }, []);

  return <h1>Streaming from Next.js API Route</h1>;
}
