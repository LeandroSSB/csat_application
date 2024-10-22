# Customer Satisfaction API

API de Pesquisa de Satisfação do Cliente desenvolvida em TypeScript seguindo os princípios da Clean Architecture. Esta API permite criar, atualizar, listar e buscar pesquisas de satisfação para diferentes públicos-alvo.

## Tecnologias Utilizadas
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker
- Winston (Logging)
- Jest (Testes)

## Requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Node.js](https://nodejs.org/) versão 16 ou superior
- [Postman](https://www.postman.com/) para testar os endpoints

## Variáveis de Ambiente
  As variáveis de ambiente são configuradas no arquivo .env. Exemplo:
  ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    NODE_ENV=development
  ```


## Instalação

### 1. Clone o repositório:
  ```bash
  git clone https://github.com/seu-usuario/seu-repositorio.git
  cd seu-repositorio
  ```
### 2. Instale as dependências:
  ```bash
  npm install
  ```
### 3. Configure o banco de dados no arquivo .env:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
  ```
### 4. Execute as migrações do Prisma para configurar o banco de dados:
  ```bash
  npx prisma migrate dev --name init
  ```
### 5. Rode a aplicação no bash ou docker:
  ```bash
  npm run dev
  ```
  ```bash
  docker-compose up --build
  ```
### 6. A aplicação estará disponível em http://localhost:3000 ou na porta espeficiada no env PORT

## Endpoints

### Postman
  A aplicação possui um arquivo .json para importar no Postman

### 1. Criar uma pesquisa de satisfação
  - POST <b> /survey </b>
  - Body(json):
    ```json
      {
        "targetAudience": "Geeks",
        "ratingStars": 5,
        "contactEmail": "geek@example.com"
      }
    ```

### 2. Atualizar uma pesquisa de satisfação
  - PUT <b> /survey/:id </b>
  - Body (json)
    ```json
    {
      "targetAudience": "Minimalistas",
      "ratingStars": 4,
      "contactEmail": "minimal@example.com"
    }
    ```

### 3. Listar todas as pesquisas
  - GET <b> /survey </b>
  - Response:
    - Status 200
    - Exemplo:
      ```json
        [
          {
            "id": 1,
            "targetAudience": "Geeks",
            "contactEmail": "geek@example.com",
            "ratingStars": 5,
            "createdAt": "2024-10-22T12:00:00Z",
            "updatedAt": null
          }
        ]
      ```

### 4. Buscar uma pesquisa pelo ID
  - GET <b> /survey/:id </b>
  - Response:
    - Status 200
    - Exemplo:
      ```json
        {
          "id": 1,
          "targetAudience": "Geeks",
          "contactEmail": "geek@example.com",
          "ratingStars": 5,
          "createdAt": "2024-10-22T12:00:00Z",
          "updatedAt": null
        }
      ```


## Logs
  Os logs da aplicação são gerados usando a biblioteca Winston. Eles são armazenados em arquivos rotacionados a cada hora, com retenção de 14 dias, e exibidos no console em ambientes de desenvolvimento.

  Os logs estão localizados no diretório src/logs.


## Testes
  - Para rodar os testes unitários, utilize o comando:
    ```bash
      npm test
    ```

## Docker (Opcional)
  Você pode utilizar o Docker para subir a aplicação e o banco de dados. Basta configurar o docker-compose.yml e executar:
  ```bash
    docker-compose up
  ```
  Isso irá configurar tanto a API quanto o banco de dados.