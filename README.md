## Live Preview

Você pode conferir uma demonstração ao vivo do projeto [aqui](https://webhelp-antd.vercel.app/).

# WebHelp - Sistema de Gestão de RH

WebHelp é um sistema desenvolvido em Next.js com NextAuth para autenticação, permitindo a gestão de vagas e cadastro de candidatos.
O sistema oferece recursos de compatibilidade entre candidatos e vagas, levando em consideração as habilidades técnicas e o domínio dos candidatos.

## Funcionalidades Principais

- Autenticação segura usando NextAuth, com suporte para login via Google.
- Gerenciamento de vagas, permitindo a criação, edição e exclusão.
- Cadastro de candidatos com informações detalhadas.
- Sistema de compatibilidade entre candidatos e vagas, considerando o peso de cada habilidade técnica.


## Como Executar Localmente

1. Clone o repositório;
2. Instale as dependências: 
``` npm install ou yarn ``` 
3. Configure as variáveis de ambiente: Crie um arquivo .env.local na raiz do seu projeto e adicione as seguintes variáveis:
``` NEXT_PUBLIC_GOOGLE_CLIENT_ID=SeuGoogleClientId;
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=SeuGoogleClientSecret;
``` 
4. npm run dev ou yarn start.