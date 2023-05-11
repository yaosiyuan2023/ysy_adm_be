"use strict";

const { signToken } = require("../lib/jwt");

module.exports = class AdminController {
  signup = async (ctx) => {
    const { nickname, email, password } = ctx.request.body;

    ctx.body = await ctx.service.admin.signup(ctx.connect, {
      nickname,
      email,
      password,
    });
  };

  login = async (ctx) => {
    const { email, password } = ctx.request.body;

    const admin = await ctx.service.admin.login(ctx.connect, {
      email,
      password,
    });

    if (admin) {
      const token = signToken(admin);
      this.logger.debug(`jwt-token:${JSON.stringify(token)}`);
      // ユーザー情報、tokenを返す
      ctx.body = {
        ...admin,
        token,
      };
    } else {
      console.error("ログイン情報が一致しません");
    }
  };
  // ログイン・パラメータルール定義
  loginValidation = () => {
    return {
      body: {
        email: this.Joi.string().required().label("メールアドレス"),
        password: this.Joi.string()
          .alphanum()
          .min(6)
          .max(30)
          .required()
          .label("パスワード"),
      },
    };
  };
};
