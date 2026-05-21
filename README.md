<div align="center">

<img src="./public/assets/imgs/logo-ifma-vertical.webp" alt="Logo IFMA Campus Caxias" width="300"/>

<h1>Plataforma de Monitoramento SINAES</h1>

<p>
Plataforma web robusta para monitoramento estratégico dos indicadores de avaliação do SINAES para o IFMA Campus Caxias.
</p>

<p>
<strong>Projeto de Trabalho de Conclusão de Curso (TCC)</strong><br/>
Bacharelado em Ciência da Computação – IFMA
</p>

<p>
<img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=for-the-badge" alt="Status do Projeto: Em Desenvolvimento" />
</p>

</div>

---

## 🧭 1. Sobre o Projeto

Esta plataforma é uma solução completa para **gerenciar e monitorar os indicadores do SINAES (Sistema Nacional de Avaliação da Educação Superior)**.

O objetivo é substituir processos manuais e planilhas fragmentadas por um sistema centralizado, dinâmico e seguro, permitindo transformar dados brutos em **inteligência estratégica**.

A plataforma está sendo desenvolvida por **Euller Gomes Teixeira**, como requisito parcial para obtenção do grau de **Bacharel em Ciência da Computação**.

Atualmente, o sistema encontra-se em fase de validação institucional, sendo testado e aprimorado para uso externo dentro do Campus Caxias.
Após a conclusão dessa etapa, sua replicabilidade será avaliada para possível implantação em outros campi e unidades do Instituto Federal do Maranhão, consolidando-se como uma ferramenta unificada para o monitoramento estratégico dos indicadores do SINAES em todo o estado.

### Objetivos principais:

- Acompanhar o desempenho histórico dos cursos.
- Identificar pontos críticos e oportunidades de melhoria.
- Gerenciar planos de ação para indicadores com notas baixas.
- Centralizar evidências e documentos comprobatórios exigidos pelo MEC/INEP.
- Fortalecer a cultura de **avaliação contínua** e **tomada de decisão baseada em dados**.

---

## ⚙️ 2. Funcionalidades Principais

A plataforma está sendo desenvolvida com múltiplos níveis de acesso, garantindo segurança e clareza no uso:

### 👥 Visão Pública (Visitante)
- Visualização transparente dos cursos e seus indicadores avaliativos.

### 🎓 Visão do Coordenador de Curso
- Gerenciamento de **Ciclos de Avaliação** (2024, 2025, ...).  
- Preenchimento e atualização dos **Indicadores** (Nota, Status, Plano de Ação).  
- Controle de aplicabilidade (**NSA – Não Se Aplica**).  
- Upload e reutilização de **Evidências** (PDFs e links de nuvem).

### 🏫 Visão da Direção
- CRUD completo de **Cursos**.  
- Associação de **Coordenadores** aos cursos.  
- Painel com **visão geral de desempenho institucional**.

### 🧩 Visão do Administrador (Admin)

- Controle global sobre os Ciclos Avaliativos de todos os cursos.
- Definição e abertura de novos ciclos institucionais (ex: “Avaliação 2025”).
- Encerramento de ciclos e bloqueio de edições após o período de coleta.
- Supervisão geral dos usuários e permissões do sistema.
- Acesso completo aos dados para fins de auditoria e gestão institucional.

---

## 🧩 3. Stack Tecnológico

| Categoria | Tecnologia | Justificativa |
|------------|-------------|---------------|
| **Framework Full-Stack** | [Next.js (App Router)](https://nextjs.org/) | Renderização no Servidor (SSR), Server Components e Server Actions para performance e segurança. |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Segurança de tipos e robustez em todo o projeto. |
| **Banco de Dados** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Banco NoSQL ideal para estrutura de documentos aninhados. |
| **ORM** | [Prisma ORM](https://www.prisma.io/) | Consultas seguras, tipadas e performáticas. |
| **Autenticação** | [Better Auth](https://www.better-auth.com/) | Integração com Prisma Adapter para autenticação e sessões. |
| **UI & Estilização** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/) | Interface moderna, responsiva e acessível. |
| **Validação** | [Zod](https://zod.dev/) | Validação de schemas compartilhada entre client e server. |
| **Armazenamento de Arquivos** | [*MinIO (S3-compatible)](https://www.min.io/) | Upload seguro de PDFs e imagens usando URLs pré-assinadas. |
| **Ambiente Local** | [Docker](https://www.docker.com/) | Containerização do MongoDB para desenvolvimento consistente. |

---

## 🖼️ 4. Screenshots

<div align="center">

### Página dos Cursos  
<img src="./public/assets/screenshots/course-page.webp" alt="Página dos Cursos" width="800" style="margin:10px;"/>

### Página de Edição do Curso  
<img src="./public/assets/screenshots/edit-couse-page.webp" alt="Página de Edição do Curso" width="800" style="margin:10px;"/>

### Página das Dimensões  
<img src="./public/assets/screenshots/dimentions-page.webp" alt="Página das Dimensões" width="800" style="margin:10px;"/>

### Página da Dimensão  
<img src="./public/assets/screenshots/dimention-page.webp" alt="Página da Dimensão" width="800" style="margin:10px;"/>

### Página do Indicador  
<img src="./public/assets/screenshots/indicator-page.webp" alt="Página do Indicador" width="800" style="margin:10px;"/>

### Página de Login  
<img src="./public/assets/screenshots/sign-in-page.webp" alt="Página de Login" width="800" style="margin:10px;"/>

</div>

---

## 🏗️ 5. Arquitetura da Solução

O projeto segue as práticas modernas do **Next.js (App Router)**:

- **App Router:** estrutura de rotas baseada em pastas.  
- **Server Components:** páginas renderizadas no servidor (`/courses`, `/dimensions`) com dados via Prisma.  
- **Client Components:** usados apenas para interatividade (`<form>`, filtros, uploads).  
- **Server Actions:** lógica de mutação e validação Zod diretamente no servidor.  
- **API Routes:** utilizadas em buscas dinâmicas, upload para o storage, etc.

---

## 🚀 6. Como Executar Localmente

### 🔧 Pré-requisitos

- [Node.js (v18+)](https://nodejs.org/)
- npm ou yarn
- [Docker + Docker Compose](https://www.docker.com/)

---

### 🌀 1. Clonar o Repositório

```bash
git clone https://github.com/eullergomes/sinaes-platform.git
cd sinaes-platform
```

### 📦 2. Instalar Dependências
```bash
npm install
```

### ⚙️ 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`.

Escolha **uma** das opções abaixo para `DATABASE_URL`.

#### Opção A: MongoDB local com Docker

```bash
# URL do banco local com replica set
DATABASE_URL="mongodb://localhost:27017/sinaes_db_local?replicaSet=rs0"
```

#### Opção B: MongoDB remoto com MongoDB Atlas

Use a string de conexão do cluster MongoDB Atlas e substitua os placeholders pelas credenciais e pelo banco desejado:

```bash
DATABASE_URL="mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/sinaes_db?retryWrites=true&w=majority"
```

Se a senha possuir caracteres especiais, use a versão codificada na URL antes de executar os comandos do Prisma.

Além da conexão com o banco, configure as demais variáveis necessárias:

```bash
# Secret de autenticação
BETTER_AUTH_SECRET="YOUR_AUTH_SECRET"

# Credenciais Cloudinary
CLOUDINARY_URL="cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>"
CLOUDINARY_CLOUD_NAME="YOUR_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_API_KEY"
CLOUDINARY_API_SECRET="YOUR_API_SECRET"

# MinIO usado nos testes do fluxo S3 local
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin"
MINIO_ENDPOINT="localhost:9000"
MINIO_BUCKET="sinaes-files"
```

### 🐳 4. Subir Serviços Locais com Docker

O `docker-compose.yml` sobe MongoDB e MinIO para desenvolvimento local:

```bash
docker-compose up -d
```

#### 4.1 MongoDB local

Se você escolheu a `DATABASE_URL` local, configure o replica set na primeira execução. Essa etapa é necessária para o MongoDB local usado pelo Prisma:

```bash
docker exec -it mongodb_local mongosh
```

Dentro do shell:
```bash
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] })
exit
```

Se você escolheu MongoDB Atlas, não é necessário usar o container MongoDB local nem executar `rs.initiate` para o banco remoto.

#### 📁 4.2 Criar o Bucket do MinIO

Para testar o fluxo MinIO/S3 local, mantenha o serviço MinIO disponível e crie o bucket usado pelos uploads. Você pode usar o script:
```bash
npm run minio:setup
```

Esse comando cria automaticamente:
- bucket `sinaes-files`
- política de leitura pública (para acesso aos PDFs)

Ou criar manualmente acessando:
```bash
http://localhost:9001
```

### 📤 4.3 Escolher o Provedor de Upload

Os arquivos enviados pelo `uploadFileService`, como avatares e evidências, usam o cookie `storage_provider` para decidir o provedor de armazenamento:

- Sem cookie, o envio usa **Cloudinary** por padrão.
- Com `storage_provider=minio`, o envio usa o fluxo **MinIO/S3**.
- Qualquer valor diferente de `minio` segue o fallback do **Cloudinary**.

Para o Cloudinary, configure as credenciais `CLOUDINARY_*` do `.env`. Para o MinIO, o serviço e o bucket devem estar disponíveis para o fluxo de upload pré-assinado.

Exemplos para testar no console do navegador:

```js
document.cookie = 'storage_provider=minio; path=/'
```

```js
document.cookie = 'storage_provider=cloudinary; path=/'
```

Para voltar ao comportamento padrão do Cloudinary, remova o cookie ou configure qualquer valor diferente de `minio`.

### 🗄️ 5. Sincronizar e Popular o Banco
```bash
# Aplica o schema do Prisma
npx prisma db push

# Gera o cliente Prisma
npx prisma generate

# (Opcional) Popula com dados de teste
npx prisma db seed
```

### 💻 6. Rodar a Aplicação
```bash
npm run dev
```

### 📚 7. Autor

👨‍💻 **Euller Gomes Teixeira**

Bacharelado em Ciência da Computação – IFMA Campus Caxias

[LinkedIn](https://www.linkedin.com/in/eullergomes)

[Repositório GitHub](https://github.com/eullergomes/sinaes-platform)

### 🪪 Licença

Este projeto está sujeito à Licença de Uso Institucional Restrita descrita no arquivo [LICENSE.md](./LICENSE.md).

O software foi desenvolvido por Euller Gomes Teixeira no contexto do TCC em Bacharelado em Ciência da Computação no IFMA Campus Caxias. A autoria, a titularidade patrimonial, a implantação, a manutenção, a migração tecnológica e a eventual replicação institucional deverão observar o registro junto ao INPI e os instrumentos formais firmados com o IFMA.

© 2026 Euller Gomes Teixeira. Todos os direitos reservados.
