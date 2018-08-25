// ライブラリの読み込み
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as cors from "cors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";

import { VWCConfig } from "./common/vwcConfig";
import { AuthAPI } from "./api/authAPI";
import { MessageUtil} from "./common/messageUtil";
import { SqliteDAO} from "./common/sqliteDAO";
import {JWTUtil} from "./common/jwtUtil";
import {V4MAPPED} from "dns";

// ----------------------------------------
// SQLite データベースの初期化
// ----------------------------------------
console.log("データベースをオープンしています・・・")
SqliteDAO.init();

// ----------------------------------------
// Express サーバの初期化
// ----------------------------------------
console.log("Express サーバを初期化しています・・・");
const app = express();

// ----------------------------------------
// クロスドメインリクエストの許可
// ----------------------------------------
app.use(cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    origin: ["http://localhost:4200", "http://localhost:49152"]
}));

// ----------------------------------------
// デバッグ用
// ----------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log((new Date().toLocaleDateString()) +
        "### URLがリクエストされました: " + req.url);
    next();
});

// ----------------------------------------
// その他の初期設定
// ----------------------------------------
app.use(bodyParser.json(
    {
        limit: VWCConfig.MAX_REQUEST_SIZE
}));
app.use(bodyParser.urlencoded(
    {
        extended: true
}));
app.use(cookieParser());
app.use(logger("dev"));

// ----------------------------------------
// ----------------------------------------
//  ここからリクエスト処理のルーティング設定
// ----------------------------------------
// ----------------------------------------

// 遅延ロードモジュール
app.use("/*.chunk.js", AuthAPI.verifyToken);

// ユーザ(フォーム)認証
app.post("/v1/auth", AuthAPI.login);

// API のアクセス許可(トークン認証) により、有効なトークンを持つリクエストのみ受付
app.use("/api/v1", AuthAPI.verifyToken);

// ----------------------------------------
// 動作確認用のエンドポイント: Get リクエスト: /ping
// ----------------------------------------
app.get("ping", (req: Request, res: Response, next: NextFunction) => {
    res
        .set("Content-Type", "application/json; charset=utf-8")
        .json({message: req.url + "のリクエストを受け付けました"})
    }
);

// ----------------------------------------
// 未定義のパスに対するリクエスト
// ----------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
    next({message: "不明なパスがリクエストされました: " + req.url});
});

// -----------------------------------------
// エラー処理(JSON フォーマット)
// -----------------------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
        MessageUtil.sendResponse(
            res, false, err.message, err.data);
    }
});


// -----------------------------------------
// Express サーバの起動
// -----------------------------------------
const port = VWCConfig.PORT_NUMBER;
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
