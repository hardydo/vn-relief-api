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

const unauthorized = (res) =>
  responseWithData(res, 401, {
    message,
  });

const forbidden = (res) =>
  responseWithData(res, 403, {
    message,
  });

const notfound = (res) =>
  responseWithData(res, 404, {
    message,
  });

const error = (res) =>
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
