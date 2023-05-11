"use strict";
const os = require("os");
const path = require("path");

const listenPort = 3400;
const contextPath = "/api";

// jwt認証キー定義
const jwt = {
  secret: "aurora-admin-secret",
  expiresIn: 60 * 24,
};

// ログ定義
const logger = {
  appenders: {
    out: { type: "stdout" },
    app: {
      type: "file",
      filename: path.join(os.homedir(), "logs", "dictionary", "console.log"),
    },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "debug" },
  },
};

// マスタ環境定義
const environment = {
  dictionary: {
    name: Symbol("dictionary"),
  },
  eijiro: {
    name: Symbol("eijiro"),
  },
};

// DB定義
const datastore = {
  endpoint: {
    point1: {
      host: "127.0.0.1",
      user: "developer",
      port: 3306,
      password: "password",
      charset: "utf8",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      timezone: "+00:00",
    },
  },
  datasource: {
    master: {
      write: { endpoint: "point1", schema: "aurora" },
      read: [{ endpoint: "point1", schema: "aurora" }],
    },
  },
  strategy: {
    master: {
      datasource: "master",
    },
    user: {
      datasource: ["user_0", "user_1"],
      rule: (n) => `user_${n % 2}`,
    },
  },
};
