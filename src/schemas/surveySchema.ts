import * as yup from "yup";

export const surveySchema = yup.object().shape({
  targetAudience: yup.string().required("targetAudience is a required field"),
  ratingStars: yup.number().required("ratingStars is a required field"),
  contactEmail: yup.string().email("Must be an email").required("email is a required field")
});

export const surveySchemaOpcional = yup.object().shape({
  targetAudience: yup.string().nullable(),
  ratingStars: yup.number().nullable(),
  contactEmail: yup.string().email("Must be an email").nullable()
});

