<h1 align="center">
  Fintech Startup
  <br>
</h1>

<p align="center">
<img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></p>

## Índice

1. [Descrição do projeto](#Descrição-projeto)
2. [Diagrama de entidade e relacionamento](#Diagrama-ERD)
3. [Tecnologias](#Tecnologias)
4. [Design Patterns e Metodologias](#Design-patterns)
5. [Instruções de uso](#Instruções-de-uso)

## 1. Descrição do projeto

Este projeto foi desenvolvido como parte de um desafio técnico para uma Fintech Startup. O objetivo é fornecer uma API RESTful construída com NestJS, utilizando boas práticas de desenvolvimento e design.

#### https://github.com/felipeas314/Backend-teste

## 2. Diagrama de entidade e relacionamento

<img src="./.github/images/diagram.png" alt="Diagram" />

## 3. Tecnologias

Principais ferramentas e tecnologias utilizadas no projeto:

- **npm** - Gerenciador de dependências
- **TypeScript** - Linguagem de programação
- **NestJS** - Framework progressivo para construir aplicações server-side eficientes, confiáveis e escaláveis com Node.js.
- **PostgreSQL** - Banco de dados relacional.
- **Prisma** - ORM para TypeScript que facilita o acesso ao banco de dados.
- **Jest** - Framework de testes para JavaScript, utilizado para garantir a qualidade do código.
- **Docker** - Plataforma de conteinerização que permite criar, testar e implantar aplicações em ambientes isolados.
- **Zod** - Biblioteca TypeScript para validação e parsing de esquemas.

## 4. Design Patterns e Metodologias

- **SOLID**
- **Dependency Injection**
- **Keep It Simple, Silly (KISS)**

## 5. Instruções de uso

### Build e start usando docker

```bash
docker-compose up -d
```

- Serão criados dois containers, fintech_app e fintech_db

### Testes com Jest

```bash
npm run test
```

## Contribuidores

[Lucas Tavares](https://www.linkedin.com/in/lucas-tavares-a25323116/)
