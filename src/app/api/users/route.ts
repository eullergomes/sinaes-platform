import prisma from '@/utils/prisma';

export async function GET() {
  const users = await prisma.users.findMany();
  console.log('Teste de conexão com o banco de dados');
  console.log('Usuários: ', users); // Apenas para teste
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' }
  });
}
