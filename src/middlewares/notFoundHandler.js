import createHttpError from 'http-errors';

export function notFoundHandler(req, res, next) {
  return next(createHttpError(404, 'Route not found'));
}