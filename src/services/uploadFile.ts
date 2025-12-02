import { getPresignedUploadUrl } from '@/actions/storage';

export async function uploadFileToMinio(file: File, folder: string) {
	const { uploadUrl, publicUrl, storageKey } = await getPresignedUploadUrl(
		file.name,
		file.type,
		folder
	);

	const upload = await fetch(uploadUrl, {
		method: 'PUT',
		body: file,
		headers: {
			'Content-Type': file.type,
		},
	});

	if (!upload.ok) {
		throw new Error('Falha ao enviar arquivo para o armazenamento.');
	}

	return {
		url: publicUrl,
		storageKey,
		fileName: file.name,
		size: file.size,
		mimeType: file.type,
	};
}
