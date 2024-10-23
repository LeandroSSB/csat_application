import request from 'supertest';
import app from '@/app'; 
import { prismaMock } from '@/singleton';
import { SurveyWithQuestions } from '@/interfaces';

describe('Survey Controller - Create Survey', () => {
  it('should return a 400 error if targetAudience is missing', async () => {
    const response = await request(app)
      .post('/survey')
      .send({ questions: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('targetAudience is a required field');
  });

  it('should create a survey successfully with valid data', async () => {
    
    prismaMock.survey.create.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    } as SurveyWithQuestions ) 

    const response = await request(app)
      .post('/survey')
      .send({ targetAudience: 'Geeks', questions: [] });

    expect(response.status).toBe(201);
    expect(response.body.targetAudience).toBe('Geeks');
    expect(response.body.questions.length).toBe(3);
    expect(response.body.id).toBe(1);
  });
});

describe('Survey Controller - Update Survey', () => {

  it('should update a survey successfully', async () => {
    const updatedSurveyData = {
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    };

    prismaMock.survey.findUnique.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    } as SurveyWithQuestions);

    prismaMock.survey.update.mockResolvedValue(updatedSurveyData as SurveyWithQuestions);

    const response = await request(app)
      .put('/survey/1')
      .send({
        targetAudience: 'Geeks',
        questions: ['Público-alvo', 'Quantidade de estrelas', 'E-mail para contato']
      });

    expect(response.status).toBe(200);
    expect(response.body.targetAudience).toBe('Geeks');
    expect(response.body.questions.length).toBe(3);
    expect(response.body.questions[0].content).toBe('Público-alvo');
  });

  it('should return 404 if survey does not exist', async () => {
    prismaMock.survey.findUnique.mockResolvedValue(null); 

    const response = await request(app)
      .put('/survey/999')
      .send({
        targetAudience: 'Esportistas',
        questions: ['Qual seu esporte favorito?']
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Survey not found');
  });

  it('should save the update date when updating a survey', async () => {
    const updatedSurvey = {
      id: 1,
      targetAudience: 'Geeks Updated',
      questions: [
        { id: 1, content: 'Público-alvo', surveyId: 1 },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ], 
    } as SurveyWithQuestions;
  

    prismaMock.survey.findUnique.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    } as SurveyWithQuestions);

    prismaMock.survey.update.mockResolvedValue(updatedSurvey);
  
    const response = await request(app).put('/survey/1').send({
      targetAudience: 'Geeks Updated',
      questions: [ "nova pergunta" ],
    }  );
    
    expect(response.status).toBe(200);
    expect(response.body.updatedAt).toEqual(updatedSurvey.updatedAt);
  });

})

describe('Survey Controller - List Surveys', () => {
  it('should list all surveys successfully', async () => {
    const surveys = [
      {
        id: 1,
        targetAudience: 'Geeks',
        questions: [
          { id: 1, content: 'Público-alvo' },
          { id: 2, content: 'Quantidade de estrelas' },
          { id: 3, content: 'E-mail para contato' },
        ],
      },
      {
        id: 2,
        targetAudience: 'Minimalistas',
        questions: [
          { id: 4, content: 'Público-alvo' },
          { id: 5, content: 'Quantidade de estrelas' },
          { id: 6, content: 'E-mail para contato' },
        ],
      },
    ];

    prismaMock.survey.findMany.mockResolvedValue(surveys as SurveyWithQuestions[]);

    const response = await request(app).get('/survey');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].targetAudience).toBe('Geeks');
    expect(response.body[1].targetAudience).toBe('Minimalistas');
  });

  
});

describe('Survey Controller - Find Survey', () => {
  it('should find a survey by ID successfully', async () => {
    const survey = {
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    };

    prismaMock.survey.findUnique.mockResolvedValue(survey as SurveyWithQuestions);

    const response = await request(app).get('/survey/1');

    expect(response.status).toBe(200);
    expect(response.body.targetAudience).toBe('Geeks');
    expect(response.body.questions.length).toBe(3);
    expect(response.body.questions[0].content).toBe('Público-alvo');
  });

  it('should return 404 if survey does not exist', async () => {
    prismaMock.survey.findUnique.mockResolvedValue(null);

    const response = await request(app).get('/survey/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Survey not found');
  });
});