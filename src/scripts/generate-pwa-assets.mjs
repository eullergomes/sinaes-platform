import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const sourceLogoPath = path.resolve('public/assets/imgs/ifma-avalia-logo.webp');
const publicPath = path.resolve('public');
const imgsPath = path.resolve('public/assets/imgs');
const tempPath = path.resolve('.tmp-icons');

async function ensureDirectories() {
	try {
		await fs.access(sourceLogoPath);
	} catch {
		throw new Error(`Logo fonte não encontrado: ${sourceLogoPath}`);
	}

	await fs.mkdir(imgsPath, { recursive: true });
	await fs.mkdir(tempPath, { recursive: true });
}

async function generateWebpLogo() {
	await sharp(sourceLogoPath)
		.resize({
			width: 600,
			height: 600,
			fit: 'inside',
			withoutEnlargement: true
		})
		.webp({
			quality: 90
		})
		.toFile(path.join(imgsPath, 'ifma-avalia-logo.webp'));
}

async function generateAppleTouchIcon() {
	await sharp(sourceLogoPath)
		.resize(180, 180, {
			fit: 'contain',
			background: {
				r: 255,
				g: 255,
				b: 255,
				alpha: 1
			}
		})
		.png()
		.toFile(path.join(publicPath, 'apple-touch-icon.png'));
}

async function generatePwaIcons() {
	await sharp(sourceLogoPath)
		.resize(192, 192, {
			fit: 'contain',
			background: {
				r: 255,
				g: 255,
				b: 255,
				alpha: 1
			}
		})
		.png()
		.toFile(path.join(publicPath, 'icon-192.png'));

	await sharp(sourceLogoPath)
		.resize(512, 512, {
			fit: 'contain',
			background: {
				r: 255,
				g: 255,
				b: 255,
				alpha: 1
			}
		})
		.png()
		.toFile(path.join(publicPath, 'icon-512.png'));
}

async function generateFavicon() {
	const sizes = [16, 32, 48];

	const pngPaths = [];

	for (const size of sizes) {
		const outputPath = path.join(tempPath, `favicon-${size}.png`);

		await sharp(sourceLogoPath)
			.resize(size, size, {
				fit: 'contain',
				background: {
					r: 255,
					g: 255,
					b: 255,
					alpha: 1
				}
			})
			.png()
			.toFile(outputPath);

		pngPaths.push(outputPath);
	}

	const icoBuffer = await pngToIco(pngPaths);

	await fs.writeFile(path.join(publicPath, 'favicon.ico'), icoBuffer);
}

async function generateManifest() {
	const manifest = {
		name: 'IFMA Avalia',
		short_name: 'IFMA Avalia',
		description:
			'Plataforma web para monitoramento dos indicadores de avaliação do SINAES no IFMA Campus Caxias.',
		lang: 'pt-BR',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		background_color: '#f9fafb',
		theme_color: '#166534',
		icons: [
			{
				src: '/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any'
			},
			{
				src: '/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any'
			}
		]
	};

	await fs.writeFile(
		path.join(publicPath, 'site.webmanifest'),
		`${JSON.stringify(manifest, null, 2)}\n`,
		'utf8'
	);
}

async function main() {
	await ensureDirectories();
	await generateWebpLogo();
	await generateAppleTouchIcon();
	await generatePwaIcons();
	await generateFavicon();
	await generateManifest();
	await fs.rm(tempPath, { recursive: true, force: true });

	console.log('Arquivos gerados com sucesso.');
}

main().catch((error) => {
	console.error('Erro ao gerar arquivos:', error);
	process.exit(1);
});
