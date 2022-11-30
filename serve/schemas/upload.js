import joi from 'joi';

export const uploadContribSchema = joi.object({
  name: joi.string().alphanum().max(40).required(),
  circuit: joi
    .string()
    .valid('deposit', 'withdraw', 'transfer', 'transform', 'tokenise', 'burn')
    .required(),
});

export const uploadBeaconSchema = joi.object({
  circuit: joi
    .string()
    .valid('deposit', 'withdraw', 'transfer', 'transform', 'tokenise', 'burn')
    .required(),
});
