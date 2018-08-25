import {Request, Response, NextFunction} from "express";
import * as jsSHA from "jssha";
import { User } from "../model/User";
import { JWTUtil } from "../common/jwtUtil";
import { SqliteDAO } from "../common/sqliteDAO";
import { MessageUtil } from "../common/messageUtil";
import { VWCConfig } from "../common/vwcConfig";

// ログイン及びトークン認証
export class AuthAPI {

    // -------------------------------------
    // 1. ログイン時のユーザ認証
    // -------------------------------------

    public static async login(req: Request, res: Response, next: NextFunction) {
        // ID及びパスワード
        const userId = req.body.userId;
        const password = req.body.password;

        console.log("userId: " + req.body.userId)

        // ユーザ情報の取得
        const query = `select loginname, firstname, lastname, role, password 
                      from users where loginname=$loginname`;
        const param = {$loginname: userId};
        const result: any = await SqliteDAO.select(query, param);

        // IDの検証
        if (result.rows.length === 0) {
            next({message: "ID情報が不正です。"});
            return;
        }

        // パスワードの検証
        const user: User = result.rows[0];
        const sha = new jsSHA("SHA-256", "TEXT");
        sha.update(password);
        //const hash = sha.getHash("B64");
        const hash = sha.getHash("HEX");
        if (hash.toLowerCase() !== user.password.toLowerCase()) {
            next({message: "パスワードが不正です。"});
            return;
        }
        console.log("### ユーザ認証に成功しました: " + user.loginname);

        // トークンの作成
        delete user.password;
        const token = JWTUtil.generateToken(
            res,
            user,
            VWCConfig.JWT_TOKEN_TIMEOUT
        );

        let apiEndpointUrl = "";
        switch (user.role) {
            case "ADMIN":
                apiEndpointUrl = VWCConfig.ADMIN_API_ENDPOINT_URL;
                break;
            case "USER":
            default:
                apiEndpointUrl = VWCConfig.USER_API_ENDPOINT_URL;
        }

        const data = {apiEndpointUrl, user};
        MessageUtil.sendResponse(res, true, "ログイン成功", data);
    }

    // -------------------------------------
    // 2. トークン認証
    // -------------------------------------
    public static verifyToken(req: Request, res: Response, next: NextFunction) {
        // リクエストからトークンを取得
        let token = JWTUtil.extractToken(req);
        if (!token) {
            next({message: "トークンが存在しません。"});
            return;
        }

        // トークンの検証
        const verifeidToken = JWTUtil.verifyToken(token);
        if (verifeidToken) {
            // トークンの更新
            const user = JWTUtil.extractUserFromToken(verifeidToken);
            token = JWTUtil.generateToken(res, user, VWCConfig.JWT_TOKEN_TIMEOUT);
            res.locals.user = user;

            next();
        } else {
            next({message: "トークンが無効です。"});
        }
    }

    // -------------------------------------
    // 3. 権限チェック
    // -------------------------------------

    public static checkRole(req: Request, res: Response, next: NextFunction) {
        if (res.locals.user.role === "ADMIN") {
            next();
        } else {
            next({message: "管理者権限が必要です。"});
        }
    }

    // -------------------------------------
    // 4. ログイン画面へのリダイレクト
    // -------------------------------------

    public static redirect(req: Request, res: Response, next: NextFunction) {
        res.redirect("/");
    }
}