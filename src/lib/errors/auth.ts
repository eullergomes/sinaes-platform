export type AuthErrorCode = string | undefined;

export function mapAuthErrorCode(
  code: AuthErrorCode,
  fallback: string = 'Falha na autenticação.'
): string {
  switch (code) {
    case 'INVALID_CREDENTIALS':
    case 'INVALID_EMAIL_OR_PASSWORD': // ok
      return 'Email ou senha inválidos.';
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL': // ok
      return 'E-mail já cadastrado.';
    case 'USER_NOT_FOUND':
      return 'Usuário não encontrado.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Email não verificado.';
    case 'RATE_LIMITED':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'WEAK_PASSWORD':
      return 'Senha muito fraca.';
    case 'INVALID_EMAIL':
      return 'Email inválido.';
    default:
      return fallback;
  }
}

type ErrorWithCode = {
  error?: { code?: string };
  code?: string;
};

export function mapAuthError(err: unknown, fallback?: string): string {
  const e: ErrorWithCode = (err ?? {}) as ErrorWithCode;
  const code: AuthErrorCode = e.error?.code ?? e.code;
  return mapAuthErrorCode(code, fallback);
}
