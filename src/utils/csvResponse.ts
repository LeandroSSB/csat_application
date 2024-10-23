import { Parser } from 'json2csv';

export const generateCsvFromSurveyResponses = (responses: any[]) => {
  const csvData = responses.map(response => {
    const answers = response.answers.reduce((acc: any, answer: any) => {
      acc[answer.question.content] = answer.answer;
      return acc;
    }, {});
    
    return answers
    
  });

  const parser = new Parser();
  const csv = parser.parse(csvData);

  return csv;
};