import request from 'supertest';
import app from '@/app';  
import { prismaMock } from '@/singleton';
import { SurveyResponseAnswers, SurveyResponseAnswersQuestions, SurveyWithQuestions } from '@/interfaces';

const mockedResponses = [
  {
    id: 1,
    surveyId: 3,
    ratingStars: 5,
    createdAt: new Date(),
    answers: [
        {
            question: {
              content: "Público-alvo"
            },
            answer: "Geeks"
        },
        {
            question: {
              content: "Quantidade de estrelas"
            },
            answer: "5"
        },
        {
            question: {
              content: "E-mail para contato"
            },
            answer: "test@lsadsa.com"
        },
        {
            question: {
              content: "Qual seu anime preferido"
            },
            answer: "Boku no hero"
        }
    ]
  }
]

describe('SurveyResponse Controller - Create Survey Response', () => {
  
  it('should return a 404 error if survey does not exist', async () => {
    prismaMock.survey.findUnique.mockResolvedValue(null);  

    const response = await request(app)
      .post('/survey/999/response') 
      .send({
        ratingStars: 5,
        answers: [
          { questionId: 1, answer: 'Great' },
        ],
      });

    expect(response.status).toBe(404);
  });

  it('should create a survey response successfully with valid data', async () => {
    prismaMock.survey.findUnique.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    } as SurveyWithQuestions );

    prismaMock.surveyResponse.create.mockResolvedValue({
      id: 1,
      ratingStars: 5,
      surveyId: 1,
      answers: [
        { id: 1, questionId: 1, answer: 'Geeks' },
        { id: 2, questionId: 2, answer: '5' },
        { id: 3, questionId: 3, answer: 'test@mail.com' },
      ],
    } as SurveyResponseAnswers );

    const response = await request(app)
      .post('/response/1')
      .send({
        ratingStars: 5,
        answers: [
          { questionId: 1, answer: 'Geeks' },
          { questionId: 2, answer: '5' },
          { questionId: 3, answer: 'test@mail.com' },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.ratingStars).toBe(5);
    expect(response.body.answers[0].answer).toBe('Geeks');
  });

  it('should return 400 if answers do not correspond to the survey questions', async () => {
    prismaMock.survey.findUnique.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
      ],
    } as SurveyWithQuestions);
  
    const response = await request(app).post('/response/1').send({
      ratingStars: 5,
      answers: [
        { questionId: 999, answer: 'Resposta inválida' }, 
      ],
    });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Survey with invalid question's id: 999 with answer: Resposta inválida `);
  });
});


describe('SurveyResponse Controller - List response options ', () => { 
  it('should list responses from existing survey', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue( mockedResponses as SurveyResponseAnswersQuestions[] )


    const response = await request(app).get('/response/list?targetAudience=otakus&sortByStars=desc');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].answers.length).toBe(4);
    expect(response.body[0].ratingStars).toBe(5);


  })
  it('should return 404 if survey does not contain any response', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue([]); 

    const response = await request(app)
      .get('/response/list?targetAudience=otakus&sortByStars=desc')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Target audience without responses');


  })

  it('should return csv format if specified', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue( mockedResponses as SurveyResponseAnswersQuestions[] )

    const response = await request(app).get('/response/list?targetAudience=otakus&sortByStars=desc&format=csv').send();;

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
  })
  
  it('should list survey responses and order them by ratingStars in ascending order', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue([
      {
        id: 1,
        ratingStars: 3,
        surveyId: 1,
        answers: [{ questionId: 1, answer: 'Bom' }],
      },
      {
        id: 2,
        ratingStars: 5,
        surveyId: 1,
        answers: [{ questionId: 1, answer: 'Excelente' }],
      },
    ]as SurveyResponseAnswers[] );
  
    const response = await request(app).get('/response/list?sort=asc');
  
    expect(response.status).toBe(200);
    expect(response.body[0].ratingStars).toBe(3);
    expect(response.body[1].ratingStars).toBe(5);
  });
  
  it('should list survey responses and order them by ratingStars in descending order', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue([
      {
        id: 1,
        ratingStars: 5,
        surveyId: 1,
        answers: [{ questionId: 1, answer: 'Excelente' }],
      },
      {
        id: 2,
        ratingStars: 3,
        surveyId: 1,
        answers: [{ questionId: 1, answer: 'Bom' }],
      },
    ] as SurveyResponseAnswers[]);
  
    const response = await request(app).get('/response/list?sort=desc');
  
    expect(response.status).toBe(200);
    expect(response.body[0].ratingStars).toBe(5);
    expect(response.body[1].ratingStars).toBe(3);
  });


})