import * as yup from "yup";

export const surveySchema = yup.object().shape({
  targetAudience: yup.string().required(),
  questions: yup.array(yup.string()).nullable()
});

export const surveySchemaOpcional = yup.object().shape({
  targetAudience: yup.string().nullable(),
  questions: yup.array(yup.string()).nullable()
});

