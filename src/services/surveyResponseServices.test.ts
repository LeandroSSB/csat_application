import { SurveyResponseAnswers, SurveyResponseAnswersQuestions, SurveyWithQuestions } from "@/interfaces";
import { fillSurvey, listSurveyResponsesByAudience } from "@/services/surveyResponseServices"
import { prismaMock } from '@/singleton';

describe('fillSurvey', () => {
  it('should fill a survey successfully', async () => {
    const surveyId = 1;
    const surveyData = {
      ratingStars: 5,
      answers: [
        { questionId: 1, answer: 'Great' },
        { questionId: 2, answer: '5 stars' },
        { questionId: 3, answer: 'tes@out.com' },
      ],
    };

    prismaMock.survey.findUnique.mockResolvedValue({
      id: surveyId,
      targetAudience: 'Geeks',
      questions: [
        { id: 1, content: 'Público-alvo' },
        { id: 2, content: 'Quantidade de estrelas' },
        { id: 3, content: 'E-mail para contato' },
      ]
    } as SurveyWithQuestions );

    prismaMock.surveyResponse.create.mockResolvedValue({
      id: 1,
      surveyId,
      ratingStars: surveyData.ratingStars,
      answers: [
        { id: 1, questionId: 1, answer: 'Great' },
        { id: 2, questionId: 2, answer: '5 stars' },
        { id: 3, questionId: 3, answer: 'tes@out.com' },
      ],
    } as SurveyResponseAnswers);

    const response = await fillSurvey({ surveyId, ...surveyData }) as SurveyResponseAnswers; 
    expect(response.ratingStars).toBe(5);
    expect(response.answers.length).toBe(3);
    expect(response.answers[0].answer).toBe('Great');
  });

  it('should throw an error if the survey does not exist', async () => {
    prismaMock.survey.findUnique.mockResolvedValue(null);

    const surveyData = { ratingStars: 4, answers: [] };
    await expect(fillSurvey({ surveyId: 99, ...surveyData })).rejects.toThrow('Survey not found');
  });
});

describe('listSurveyResponsesByAudience', () => {
  it('should list responses based on the target audience', async () => {
    const targetAudience = 'Geeks';
    prismaMock.surveyResponse.findMany.mockResolvedValue([
      {
        id: 1,
        surveyId: 3,
        ratingStars: 5,
        createdAt: new Date(),
        answers: [
          {
            question: { content: 'Público-alvo' },
            answer: 'Geeks',
          },
        ],
      },
    ] as SurveyResponseAnswersQuestions[]);

    const responses = await listSurveyResponsesByAudience(targetAudience, 'asc');
    expect(responses.length).toBe(1);
    expect(responses[0].ratingStars).toBe(5);
    expect(responses[0].answers[0].answer).toBe('Geeks');
  });

  it('should return an empty array if no responses match the target audience', async () => {
    prismaMock.surveyResponse.findMany.mockResolvedValue([]);

    await expect(listSurveyResponsesByAudience('Nonexistent Audience', 'asc'))
      .rejects
      .toThrow('Target audience without responses');
  });
});