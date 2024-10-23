import { prismaMock } from '@/singleton';
import { createSurvey } from "@/services/surveyServices"
import { SurveyWithQuestions } from '@/interfaces';


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