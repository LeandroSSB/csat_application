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

Endpoints
---------

### 1\. Criar pesquisa

Este endpoint permite que você crie uma nova pesquisa com os campos obrigatórios: público-alvo, Quantidade de estrelas e e-mail de contato. 

#### Request
  ```
    POST /survey
  ```

##### Body

  ```json   
    {
      "targetAudience": "Geeks",
      "questions": ["Custom question 1", "Custom question 2"]
    }
  ```

#### Resposta

Com sucesso, a API responde junto com  as perguntas obrigatórias:

  ```json
    {
      "id": 1,
      "targetAudience": "Geeks",
      "questions": [
        { "id": 1, "content": "Público-alvo" },
        { "id": 2, "content": "Quantidade de estrelas" },
        { "id": 3, "content": "E-mail para contato" },
        { "id": 4, "content": "Custom question 1" },
        { "id": 5, "content": "Custom question 2" }
      ]
    }
  ```

### 2\. Atualizar pesquisa

Este endpoint permite atualizar uma pesquisa por ID.

#### Request
  ```
    PUT /survey/:id
  ```

##### Body

  ```json
    {
      "targetAudience": "Minimalistas",
      "questions": ["New Question 1", "New Question 2"]
    }
  ```

#### Resposta

Retorna a pesquisa atualizada

  ```json
    {
      "id": 1,
      "targetAudience": "Minimalistas",
      "createdAt": "2024-10-22T20:33:39.036Z",
      "updatedAt": "2024-10-23T17:43:22.504Z",
      "questions": [
        { "id": 1, "content": "Público-alvo", "surveyId": 1  },
        { "id": 2, "content": "Quantidade de estrelas", "surveyId": 1 },
        { "id": 3, "content": "E-mail para contato", "surveyId": 1 },
        { "id": 6, "content": "New Question 1", "surveyId": 1 },
        { "id": 7, "content": "New Question 2", "surveyId": 1 }
      ]
    }
  ``` 

### 3\. Responder Pesquisa

Este endpoint permite responde uma pesquisa por id

#### Request
  ```
    POST /response/:id
  ```
##### Body

  ```json
    {
      "ratingStars": 5,
      "answers": [
        { "questionId": 1, "answer": "Geeks" },
        { "questionId": 2, "answer": "5 stars" }
      ]
    }
  ```    

#### Response

Retorna o objeto da resposta

  ```json
    {
      "id": 1,
      "surveyId": 1,
      "ratingStars": 5,
      "survey": {
        "id": 3,
        "targetAudience": "Geeks",
        "createdAt": "2024-10-22T20:36:12.694Z",
        "updatedAt": "2024-10-22T20:36:12.694Z"
      },
      "createdAt": "2034-10-23T19:23:40.029Z",
      "answers": [
        { "id": 1, "questionId": 1, "responseId": 1, "answer": "Geeks" },
        { "id": 2, "questionId": 2, "responseId": 1, "answer": "5 stars" }
      ]
    }
  ```    

### 4\. Listar Respostas de pesquisas por publico alvo

Este endpoint lista as respostas da pesquisa filtradas por público-alvo, com filtro opcional de estrelas e formato da resposta( json ou csv).

#### Request
  ```
    GET /response/list?targetAudience=Geeks&sortByStars=asc&format=csv
  ```
#### Response

  ```json
    [
      {
        "id": 1,
        "surveyId": 3,
        "ratingStars": 5,
        "createdAt": "2024-10-22T20:47:52.578Z",       
        "answers": [
          {
            "question": { "content": "Público-alvo" },
            "answer": "Geeks"
          }
        ]
      }
    ]
  ```    

### 5\. Listar pesquisas

Este endpoint lista as pesquisas.

#### Request
  ```
    GET /survey
  ```
#### Response

  ```json
    [
     {
        "id": 1,
        "targetAudience": "Geeks",
        "createdAt": "2024-10-22T20:34:15.479Z",
        "updatedAt": "2024-10-22T20:34:15.479Z",
        "questions": [
            {
                "id": 1,
                "content": "Público-alvo",
                "surveyId": 1
            },
            {
                "id": 2,
                "content": "Quantidade de estrelas",
                "surveyId": 1
            },
            {
                "id": 3,
                "content": "E-mail para contato",
                "surveyId": 1
            }
        ]
    },
    ]
  ```     

### 5\. Encontrar pesquisa

Este endpoint encontra uma pesquisa por ID.

#### Request
  ```
    GET /survey
  ```
#### Response

  ```json
    
  {
    "id": 1,
    "targetAudience": "Geeks",
    "createdAt": "2024-10-22T20:34:15.479Z",
    "updatedAt": "2024-10-22T20:34:15.479Z",
    "questions": [
        {
            "id": 1,
            "content": "Público-alvo",
            "surveyId": 1,
            "answers": []
        },
        {
            "id": 2,
            "content": "Quantidade de estrelas",
            "surveyId": 1,
            "answers": []
        },
        {
            "id": 3,
            "content": "E-mail para contato",
            "surveyId": 1,
            "answers": []
        }
    ]
  }
    
  ```     


### Respostas de Erro

Se ocorrer algum erro, como uma pesquisa não encontrada ou requisição inválida, a API retornará uma resposta de erro apropriada com um código de status 4xx ou 5xx.

#### Example
  ```json
    {
      "status": "error",
      "statusCode": 400,
      "message": ""
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