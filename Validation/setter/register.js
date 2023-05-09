const joi = require("joi");

const registerValidation = (req, res, next) => {
  console.log(req.headers, req.body);
  const validate = joi.object().keys({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    promo:joi.number()
  });

  const { error } = validate.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    res.status(404).json({ error: error.message });
  }
};

const loginValidation = (req, res, next) => {
  const validate = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = validate.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { registerValidation, loginValidation };
