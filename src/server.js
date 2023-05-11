import express from "express"; //passwordのハッシュ化を行う（dataを不規則な文字列にする
import mysql from "mysql2";
import cors from "cors"; //HTTPサーバーやファイルシステムへのアクセス、データのストリーミング、非同期処理、暗号化、デバッグなどが含まれています。
import router from "./core/router.js";
import bcrypt from "bcrypt";
import _ from "lodash";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const SaltRounds = 10;

const db = mysql.createPool({
  host: "localhost",
  user: "developer",
  password: "password",
  database: "mylogin_user_data",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

const selectOne = (conn) => {
  return async (sql, values = []) => {
    conn = await conn.promise();
    console.log(`[SQL]: ${conn.format(sql, values)}`);
    const [data] = await conn.query(sql, values);
    if (_.isArray(data)) {
      if (data.length > 1) {
        throw new Error(
          `Expected one result (or null) to be returned by selectOne(), but found: ${data.length}`
        );
      }
      return data[0];
    }
    return data;
  };
};

router.post("/signup", (req, res) => {
  const sql = "INSERT INTO signup (nickname,email,password) VALUES (?)";
  bcrypt.hash(req.body.password, SaltRounds, (err, hash) => {
    // 对密码进行哈希处理
    if (err) {
      return res.json("Error");
    }
    const values = [req.body.nickname, req.body.email, hash]; // 用哈希值替换明文密码
    db.query(sql, [values], (err, data) => {
      if (err) {
        return res.json("Error");
      }
      return res.json(data);
    });
  });
  res.send(req.body);
});

const checkUser = async (email, password) => {
  const user = await selectOne(db)("SELECT * FROM signup WHERE email = ?", [
    email,
  ]);
  if (!user) {
    return false;
  }
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return false;
  }
  return true;
};

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const validUser = await checkUser(email, password);
  if (!validUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.status(200).json({ message: "Success", data: req.body });
});

app.listen(8081, () => {
  console.log("Server is running on port 3001");
});
