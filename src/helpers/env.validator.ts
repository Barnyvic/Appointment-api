// import * as Joi from 'joi';
import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  REDIS_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_USERNAME: Joi.string().optional(),
  REDIS_PASSWORD: Joi.string().optional(),

  // FIREBASE_PROJECT_ID: Joi.string().required(),
  // FIREBASE_PRIVATE_KEY: Joi.string().required(),
  // FIREBASE_CLIENT_EMAIL: Joi.string().required(),

  GOOGLE_MAPS_ACCESS_KEY: Joi.string().optional(),

  CLD_CLOUD_NAME: Joi.string().optional(),
  CLD_API_KEY: Joi.string().optional(),
  CLD_API_SECRET: Joi.string().optional(),

  SMTP_PASSWORD: Joi.string().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.string().optional(),
  SMTP_FROM: Joi.string().optional(),

  BREVO_API_KEY: Joi.string().required(),

  S3_PROVIDER: Joi.string().required(),
});
