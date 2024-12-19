const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).send({
    statusCode: statusCode,
    data: data,
  });

const ok = (res, message) =>
  responseWithData(res, 200, {
    message,
  });

const created = (res, message) =>
  responseWithData(res, 201, {
    message,
  });

const badRequest = (res, message) =>
  responseWithData(res, 400, {
    message,
  });

const unauthorized = (res, message) =>
  responseWithData(res, 401, {
    message,
  });

const forbidden = (res, message) =>
  responseWithData(res, 403, {
    message,
  });

const notfound = (res, message) =>
  responseWithData(res, 404, {
    message,
  });

const error = (res, message) =>
  responseWithData(res, 500, {
    message,
  });

const ResponseStatus = {
  responseWithData,
  error,
  badRequest,
  ok,
  unauthorized,
  notfound,
  created,
  forbidden,
};
export default ResponseStatus;
