type SignatureResponse = {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  original_filename: string;
  // Adicionar outros campos se precisar
};

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResponse> {
  const sigRes = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder })
  });
  if (!sigRes.ok) {
    const errorData = await sigRes.json();
    throw new Error(errorData.error || 'Falha ao gerar assinatura Cloudinary');
  }
  const { timestamp, signature, apiKey, cloudName }: SignatureResponse =
    await sigRes.json();

  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', apiKey);
  fd.append('timestamp', String(timestamp));
  fd.append('signature', signature);
  fd.append('folder', folder);

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: fd
    }
  );
  if (!upRes.ok) {
    const errorData = await upRes.json();
    console.error('Cloudinary upload error:', errorData);
    throw new Error(
      `Falha no upload para Cloudinary: ${errorData?.error?.message || 'Erro desconhecido'}`
    );
  }
  const data: CloudinaryUploadResponse = await upRes.json();
  return data;
}
