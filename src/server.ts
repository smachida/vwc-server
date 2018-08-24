import * as express from "express";
import {NextFunction, Request, Response} from "express";

const app = express();

// ----------------------------------------
// JWT トークン認証処理
// POST リクエスト: /auth
// ----------------------------------------
import * as bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import { Key } from "./key";

app.use(bodyParser.json());

app.post("/auth", (request: Request, response: Response, next: NextFunction) => {
    // トークンの取得
    const token = request.body.token;
    try {
        jwt.verify(
            token,
            Key.PUBLIC,
            {algorithms: ["RS256"]}
        );
    } catch (e) {
        next({message: "#### 不正なトークン: " + e.message});
        return;
    }
    response
        .set("Content-Type", "application/json; charset=utf-8")
        .json({message: "**** 正常なトークン"});
    }
);

// ----------------------------------------
// Get リクエスト: /ping
// ----------------------------------------
app.get("/ping", (request: Request, response: Response, next: NextFunction) => {
    response
        .set("Content-Type", "application/json; charset=utf-8")
        .json({message:request.url + "のリクエストを受け付けました"})
    }
);

// 未定義のパスに対するリクエスト
app.use((request: Request, response: Response, next: NextFunction) => {
        next({message: "不正なパスに対するリクエスト"});
    }
);

// -----------------------------------------
// エラー処理(JSON フォーマット)
// -----------------------------------------
app.use((err: any, request: Request, response: Response, next: NextFunction) => {
    response
        .set("Content-Type", "application/json; charset-utf-8")
        .json(err);
    }
);


// -----------------------------------------
// Express サーバの起動
// -----------------------------------------
const port = 3000;
app.listen(
    port,
    () => {
        console.info("*** Virtual Wine Cellar(VWC) Server: 0.1.0 ***");
        console.info(port + " 番ポートで待機中...");
    }).on("error", (error) => {
        console.error("起動に失敗しました。 " + error.message);
        process.exit(1);
    }
);