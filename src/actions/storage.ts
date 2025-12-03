'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
	region: 'us-east-1',
	endpoint: 'http://localhost:9000',
	credentials: {
		accessKeyId: 'minioadmin',
		secretAccessKey: 'minioadmin',
	},
	forcePathStyle: true,
});

function sanitizeFolder(folder?: string): string {
	const fallback = 'uploads';

	if (!folder) return fallback;

	const trimmed = folder.trim();

	if (!trimmed) return fallback;

	if (!/^[a-zA-Z0-9_\-\/]+$/.test(trimmed)) {
		throw new Error('Nome de pasta inválido.');
	}

	// remove barras duplicadas no início/fim
	return trimmed.replace(/^\/+|\/+$/g, '');
}

export async function getPresignedUploadUrl(
	fileName: string,
	fileType: string,
	folder?: string
) {
	const safeFolder = sanitizeFolder(folder);

	const normalizedFileName = fileName.replace(/\s+/g, '_');
	const uniqueFileName = `${Date.now()}-${normalizedFileName}`;

	const objectKey = `${safeFolder}/${uniqueFileName}`;

	const command = new PutObjectCommand({
		Bucket: 'sinaes-files',
		Key: objectKey,
		ContentType: fileType,
	});

	try {
		const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

		return {
			uploadUrl,
			publicUrl: `http://localhost:9000/sinaes-files/${objectKey}`,
			storageKey: objectKey,
		};
	} catch (error) {
		console.error('Erro ao gerar URL pré-assinada:', error);
		throw new Error('Falha ao preparar upload.');
	}
}
