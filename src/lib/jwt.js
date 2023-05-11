"use strict";

const jsonwebtoken = require("jsonwebtoken");
const jwt = require("koa-jwt");
const {
  contextPath,
  jwt: { secret: DefaultSecret, expiresIn },
} = require("../config");
const { ignoreValidatePath } = require("../router");

const getLogger = require("./logger");

// デフォルト timeout時間(秒)
const DefaultExpire = 60 * 24 * 30;

const signToken = (profile, secret = DefaultSecret) => {
  return jsonwebtoken.sign(profile, secret, {
    expiresIn: `${expiresIn ?? DefaultExpire}m`,
  });
};

const verifyToken = (token, secret = DefaultSecret) => {
  return jsonwebtoken.verify(token, secret);
};

const getJwtUser = (ctx) => {
  return ctx.state?.user ?? {};
};

const logger = getLogger("jwt");

const jwtMiddleware = jwt({ secret: DefaultSecret, passthrough: false }).unless(
  {
    path: ignoreValidatePath.map((path) => `${contextPath}${path}`),
  }
);
// logging user-info
const userLoggingMiddleware = function (ctx, next) {
  logger.info("user-info", JSON.stringify(ctx.state?.user ?? {}));
  return next();
};

module.exports = {
  signToken,
  verifyToken,
  jwtMiddleware,
  userLoggingMiddleware,
  getJwtUser,
};
