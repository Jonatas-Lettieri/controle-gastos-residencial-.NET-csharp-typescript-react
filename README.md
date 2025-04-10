# Projeto refeito com .Net e C# (backend), Typescript e React (frontend) gastos_residenciais (jonatas_saadi_de_almeida_lettieri);


## Introdução:

- Olá, meu nome é Jônatas Saadi de Almeida Lettieri, espero que esteja tudo bem com você. Então aqui estão algumas anotações importantes;


# Comandos Importantes a serem feitos pelo terminal:

    * Instalação de dependências do back end:
        - Execute: cd ControleGastos.API
        - Execute: dotnet clean
        - Execute: dotnet restore
        - Execute: dotnet build

    * Instalação de dependências do frontend (o comando npm install é utilizado em duas partes):
        - Execute na raíz do projeto:
            -> npm install
        - Execute na raíz do projeto novamente os comandos a seguir:
            -> cd ControleGastos.Web
            -> npm install

# Criar um Banco de Dados postgreSQL:

* No SQL Editor de uma plataforma de banco de dados execute o seguinte comando:
    - CREATE DATABASE ControleGastos;
    - As configurações do Banco de dados utilizado no projeto está na pasta appsettings.json;


# Fazer as migrações para o Banco de dados pelo terminal:

    * As migrations já estão nos arquivos do projeto, então só precisa aplicar as migrations existentes ao banco de dados:
        - Execute: cd ControleGastos.API
        - Execute: dotnet ef database update


# Comandos para rodar o projeto ao todo:

* Explicação de como rodar os dois ao mesmo tempo (frontend e backend):
    - Esse projeto tem dois package.json e precisa rodar tanto o frontend quanto o backend simultaneamente, por isso eu utilizo a ferramenta concurrently para orquestrar isso.

    - Na raiz do projeto eu utilizei -> npm install concurrently --save-dev

    - E adicionei no package.json da raiz esse código:
        -> {
            "scripts": {
            "dev": "concurrently \"npm run dev --prefix Frontend\" \"dotnet watch run --project Backend/ControleGastos.API.csproj\""
                       }
           }

    - Para rodar o projeto com um único comando:
        * Abra um terminal, verifique se está na raiz do projeto e execute esse comando:
            -> npm run dev

    - Abra um navegador em coloque está url para acessar o projeto:
        -> http://localhost:5173/


# Avisos finais:
- Esse projeto foi feito com o intuito de criar um sistema de controle de gastos residencial utilizando .NET com C# no backend e Typescript com React no frontend;

- Obrigado;