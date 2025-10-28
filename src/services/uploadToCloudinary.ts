async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch('/api/cloudinary-signature', { method: 'POST' });
  if (!sigRes.ok) throw new Error('Falha ao gerar assinatura');
  const { timestamp, folder, signature, apiKey, cloudName } = await sigRes.json();

  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', apiKey);
  fd.append('timestamp', String(timestamp));
  fd.append('signature', signature);
  fd.append('folder', folder);

  const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!upRes.ok) throw new Error('Falha no upload');
  const data = await upRes.json();
  return data.secure_url as string;
}

export default uploadToCloudinary;