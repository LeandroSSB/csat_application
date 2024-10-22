import * as yup from "yup";

const answer = yup.object().shape({
  questionId: yup.number().required(),
  answer: yup.string().required()
})

const surveyResponseSchema = yup.object().shape({
  answers: yup.array(answer).required(),
  ratingStars: yup.number().required(),
});


export default surveyResponseSchema