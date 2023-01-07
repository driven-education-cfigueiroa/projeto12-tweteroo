import Joi from "joi";

export const signUpSchema = Joi.object({
    username: Joi.string().required(),
    avatar: Joi.string().uri().required(),
});

export const tweetsSchema = Joi.object({
    username: Joi.string().required(),
    tweet: Joi.string().required(),
});