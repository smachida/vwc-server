import { Key } from "./key";
import * as jwt from "jsonwebtoken";

// 認証用のサンプルユーザ
const userData = {
  id: 1000, name: "山田　太郎", role: "user", dept: "開発"
};

// JWTの生成
export const tokenStr = jwt.sign(
    userData,
    Key.PRIVATE,
    {
        algorithm: "RS256",
        expiresIn: 7200
    }
);

console.log("\n\n");
console.log(tokenStr);
console.log("\n\n");

console.log("Decoded: ")
console.log(jwt.decode(tokenStr));