import * as yup from "yup";

const surveyResponseSchema = yup.object().shape({
  response: yup.string().required("Response is a required field"),
  stars: yup.number().required("Stars is a required field")
});


export default surveyResponseSchema