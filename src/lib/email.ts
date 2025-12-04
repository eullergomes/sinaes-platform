import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, url: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY não está definida!');
      return;
    }

    const realTo = 'eullertexeira@gmail.com';
    const brandPrimary = '#5eaf3c';
    const brandDark = '#222';
    const muted = '#6b7280';

    const ifmaAvaliaLogo = '/assets/imgs/ifma-avalia-logo.png';
    const ifmaLogo = '/assets/imgs/logo-ifma-horizontal-fundo-branco.png';
    const html = `
			<!doctype html>
			<html lang="pt-BR">
				<head>
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Redefinição de senha – IFMA Avalia</title>
					<style>
						.container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; }
						.header { padding: 24px 24px 0 24px; text-align: center; }
						.brand { font-weight: 700; font-size: 20px; color: ${brandDark}; }
						.body { padding: 24px; color: ${brandDark}; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
						.title { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
						.text { font-size: 14px; line-height: 1.6; color: ${muted}; margin: 0 0 16px; }
						.btn { display: inline-block; background: ${brandPrimary}; color: #fff !important; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; }
						.link { word-break: break-all; color: ${brandPrimary}; text-decoration: underline; }
						.footer { padding: 0 24px 24px; color: ${muted}; font-size: 12px; text-align: center; }
						.divider { height: 1px; background: #e5e7eb; margin: 16px 0; border: none; }
					</style>
				</head>
				<body style="background:#f8fafc; padding: 24px;">
					<div class="container">
						<div class="header">
							<img src=${ifmaAvaliaLogo}" alt="IFMA Avalia" style="height: 80px; width: auto; display: inline-block; vertical-align: middle;" />
							<h1 class="font-bold text-2xl">IFMA Avalia</h1>
						</div>
						<div class="body">
							<h1 class="title">Redefinição de senha</h1>
							<p class="text">Você solicitou a redefinição da sua senha no sistema IFMA Avalia.</p>
							<p class="text">Para continuar, clique no botão abaixo. O link expira em <strong>1 hora</strong>.</p>
							<p style="text-align:center; margin: 20px 0;">
								<a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">Redefinir senha</a>
							</p>
							<hr class="divider" />
							<p class="text">Se o botão não funcionar, copie e cole este endereço no navegador:</p>
							<p class="text"><a class="link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>
							<p class="text">Se você não solicitou esta ação, pode ignorar este e-mail com segurança.</p>
						</div>
						<div class="footer">
							<p>Instituto Federal do Maranhão – Campus Caxias</p>
							<img src=${ifmaLogo} alt="IFMA Avalia" style="height: 60px; width: auto; display: inline-block; vertical-align: middle;" />
						</div>
					</div>
				</body>
			</html>
		`;

    const response = await resend.emails.send({
      from: 'IFMA Avalia <onboarding@resend.dev>',
      to: realTo,
      subject: 'Redefinição de senha',
      html
    });

    console.log('Resposta do Resend:', response);
  } catch (error) {
    console.error('Erro ao enviar email de reset:', error);
  }
}
