import { NextResponse } from 'next/server';
import crypto from 'crypto';

type RequestBody = {
  folder?: string;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = body.folder || 'default_uploads';

    if (!/^[a-zA-Z0-9_\-\/]+$/.test(folder)) {
        return NextResponse.json({ error: 'Nome de pasta inválido.' }, { status: 400 });
    }

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const secret = process.env.CLOUDINARY_API_SECRET;

    if (!secret) {
      throw new Error('Variável CLOUDINARY_API_SECRET não configurada.');
    }

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + secret)
      .digest('hex');

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
     console.error("Erro ao gerar assinatura Cloudinary:", error);
     return NextResponse.json({ error: 'Falha ao gerar assinatura.' }, { status: 500 });
  }
}