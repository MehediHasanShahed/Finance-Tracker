// app/api/arcjet/scan.ts
import fetch from 'node-fetch'; // or native fetch in Next.js 13+
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const res = await fetch('https://api.arcjet.com/check', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ARCJET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
