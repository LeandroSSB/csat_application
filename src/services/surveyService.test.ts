import { prismaMock } from '@/singleton';
import { createSurvey, findSurvey as findSurveyService, listSurveys as listSurveysService, updateSurvey as updateSurveyService } from "@/services/surveyServices"
import { SurveyWithQuestions, UpdateSurveyData } from '@/interfaces';


describe('Survey Service - Create Survey', () => {
  it('should create a survey with mandatory questions', async () => {
    
    prismaMock.survey.create.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    } as SurveyWithQuestions );

    const survey = await createSurvey({ targetAudience: 'Geeks', questions: []});
    expect(survey.questions.length).toBe(3);
    expect(survey.targetAudience).toBe('Geeks');
    expect(survey.questions[0].content).toBe('Público-alvo');
  });

  it('should create a survey with additional questions', async () => {

    prismaMock.survey.create.mockResolvedValue({
      id: 2,
      targetAudience: 'Minimalistas',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
        { id: 4, content: 'Qual seu estilo de roupa favorito?' },
      ],
    }as SurveyWithQuestions );


    const survey = await createSurvey({ targetAudience: 'Minimalistas', questions: ['Qual seu estilo de roupa favorito?']});
    expect(survey.questions.length).toBe(4);
    expect(survey.questions[3].content).toBe('Qual seu estilo de roupa favorito?');
  });
});


describe('updateSurveyService', () => {
  it('should update an existing survey', async () => {
    const surveyData = {
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    };
    const surveyDataUpdated = {
      id: 1,
      targetAudience: 'GeeksUpdate',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ],
    };

    prismaMock.survey.findUnique.mockResolvedValue(surveyData as SurveyWithQuestions);
    prismaMock.survey.update.mockResolvedValue(surveyDataUpdated as SurveyWithQuestions);

    const surveyUpdate = {
      targetAudience: 'GeeksUpdate',
      questions: [
        'Público-alvo',
          'Quantidade de estrelas',
          'E-mail para contato',
      ],
    };

    const updatedSurvey = await updateSurveyService(1, surveyUpdate as UpdateSurveyData);

    

    expect(updatedSurvey?.targetAudience).toBe('GeeksUpdate');
  });

  it('should throw an error if the survey does not exist', async () => {
    prismaMock.survey.update.mockRejectedValue(new Error('Survey not found'));

    await expect(updateSurveyService(99, { targetAudience: 'Unknown', questions: [] }))
      .rejects
      .toThrow('Survey not found');
  });
});

describe('findSurveyService', () => {
  it('should return the survey if it exists', async () => {
    prismaMock.survey.findUnique.mockResolvedValue({
      id: 1,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
      ],
    } as SurveyWithQuestions);

    const survey = await findSurveyService(1);
    expect(survey).toBeDefined();
    expect(survey.targetAudience).toBe('Geeks');
  });

  it('should throw error if the survey does not exist', async () => {
    prismaMock.survey.findUnique.mockResolvedValue(null);

    await expect(findSurveyService(99))
      .rejects
      .toThrow('Survey not found');
  });
});

describe('listSurveysService', () => {
  it('should return a list of surveys', async () => {
    prismaMock.survey.findMany.mockResolvedValue([
      {
        id: 1,
        targetAudience: 'Geeks',
        questions: [
          { id: 1, content: 'Público-alvo' },
        ],
      },
      {
        id: 2,
        targetAudience: 'Minimalistas',
        questions: [
          { id: 2, content: 'Quantidade de estrelas' },
        ],
      },
    ] as SurveyWithQuestions[]);

    const surveys = await listSurveysService() || [];
    expect(surveys.length).toBe(2);
    expect(surveys[0].targetAudience).toBe('Geeks');
  });

  it('should return an empty array if no surveys are found', async () => {
    prismaMock.survey.findMany.mockResolvedValue([]);

    const surveys = await listSurveysService();
    expect(surveys?.length).toBe(0);
  });
});