import createHttpError from 'http-errors';

export async function validateBody(schema) {
  return async function (req, res, next) {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const error = createHttpError(404, 'Bad Request', {
        errors: err.details,
      });
      next(error);
    }
  };
}
