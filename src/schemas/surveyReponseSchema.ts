import * as yup from "yup";

const surveyReponseSchema = yup.object().shape({
  response: yup.string().required("Reponse is a required field"),
  stars: yup.number().required("Stars is a required field")
});


export default surveyReponseSchema