import * as yup from "yup";

const surveySchema = yup.object().shape({
  targetAudience: yup.string().required("targetAudience is a required field"),
  ratingStars: yup.number().required("ratingStars is a required field"),
  contactEmail: yup.string().email("Must be an email").required("email is a required field")
});


export default surveySchema