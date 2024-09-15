<h1 align="center">
  Fintech Startup
  <br>
</h1>

<p align="center">

  <img src="https://img.shields.io/badge/Nestjs-10.0-darkred" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/Typescript-5.1.3-darkblue" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/PostgreSQL-13.4-blue" alt="PostgreSQL Version" />
  <img src="https://img.shields.io/badge/Prisma-5.19.1-lightblue" alt="Prisma Version" />
  <img src="https://img.shields.io/badge/Jest-29.5.0-brightgreen" alt="Jest Version" />
  <img src="https://img.shields.io/badge/Docker-24.0.3-blue" alt="Docker Version" />
  <img src="https://img.shields.io/badge/Swagger-7.4.0-green" alt="Swagger Version" />
  <img src="https://img.shields.io/badge/bcrypt-5.1.1-orange" alt="bcrypt Version" />
  <img src="https://img.shields.io/badge/redis-3.1.2-red" alt="redis Version" />
</p>

## Índice

1. [Descrição do projeto](#Descrição-projeto)
2. [Tecnologias](#Tecnologias)
3. [Design Patterns e Metodologias](#Design-patterns)
4. [Arquitetura e Armazenamento](#Arquitetura-e-Armazenamento)
5. [Diagrama de entidade e relacionamento](#Diagrama-ERD)
6. [Instruções de uso](#Instruções-de-uso)
7. [Documentação da API](#Documentação-da-API)
8. [Contribuidores](#Contribuidores)

## 1. Descrição do projeto

Este projeto foi desenvolvido como parte de um desafio para uma Fintech Startup. O objetivo é fornecer uma API RESTful construída com NestJS, seguindo boas práticas de desenvolvimento e design, para uma plataforma de pagamentos que permite transferências entre usuários e lojistas.

## 2. Tecnologias

Principais ferramentas e tecnologias utilizadas no projeto:

- **NestJS** - Framework progressivo para construir aplicações server-side eficientes, confiáveis e escaláveis com Node.js.
- **npm** - Gerenciador de dependências
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional.
- **Prisma** - ORM para TypeScript que facilita o acesso ao banco de dados.
- **Jest** - Framework de testes para JavaScript, utilizado para garantir a qualidade do código.
- **Docker** - Plataforma de conteinerização que permite criar, testar e implantar aplicações em ambientes isolados.
- **Swagger** - Ferramenta para documentação da API
- **bcrypt** - Biblioteca para hashing de senhas
- **redis** - Sistema de cache para otimização de performance

## 3. Design Patterns e Metodologias

- **SOLID** - Princípios de design de software para promover a manutenção e escalabilidade
- **Dependency Injection** - Técnica para desacoplar componentes e facilitar a manutenção
- **Repository Pattern** - Desacoplamento da lógica de acesso a dados
- **Strategy Pattern** - Permite a adição de novos tipos de transferência sem alterar o código existente
- **Keep It Simple, Silly (KISS)** - Princípio para manter o código simples e fácil de entender

## 4. Arquitetura e Armazenamento

A aplicação adota uma arquitetura organizada com um sistema de armazenamento logs. Utiliza o Redis para caching em diversas partes da aplicação, o que ajuda a otimizar o desempenho e reduzir o tempo de resposta das operações.

Além disso, a aplicação implementa um sistema de armazenamento baseado em arquivos com identificadores de correlação. Isso garante que os dados e logs sejam armazenados de forma organizada e facilmente recuperável, facilitando a gestão e a análise dos dados através de outras ferramentas.

## 5. Diagrama de entidade e relacionamento

<img src="./.github/images/diagram.png" alt="Diagram" />

## 6. Instruções de uso

### Build e start usando docker

Para iniciar a aplicação e o banco de dados, use o comando:

```bash
docker-compose up -d
```

- Serão criados os containers fintech_app, postgres e redis
- A aplicação estará disponível em [localhost:3000](http://localhost:3000/)

### Testes com Jest

Para rodar os testes, use o comando:

```bash
npm run test
```

## 7. Documentação da API

A documentação da API está disponível em [Swagger](http://localhost:3000/docs/) após iniciar a aplicação.

## 8. Contribuidores

[Lucas Tavares](https://www.linkedin.com/in/lucas-tavares-a25323116/)
