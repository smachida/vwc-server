import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { VWCConfig } from "./vwcConfig";
import { TokenKey} from "./tokenKey";
import { User } from "../model/User";

// JWTトークンの処理(生成/取得/検証)
export class JWTUtil {

    // ---------------------------------------------
    // 新しいトークンの生成および "set-cookie" ヘッダへの設定
    // ---------------------------------------------
    public static generateToken(res: Response, user: User, timeout?): string {
        // トークンの生成
        const token = jwt.sign(
           user,
           TokenKey.PRIVATE,
            { algorithm: "RS256", expiresIn: timeout || VWCConfig.JWT_TOKEN_TIMEOUT}
        ) ;

        // set-cookie ヘッダの設定
        res.cookie(VWCConfig.JWT_TOKEN_HEADER,
            VWCConfig.JWT_TOKEN_PREFIX + token);
        return token;
    }

    // ---------------------------------------------
    // リクエストからトークンの取得
    // ---------------------------------------------
    public static extractToken(req: Request): string {
        let token = req.cookies[VWCConfig.JWT_TOKEN_HEADER] || "";
        token = token.replace(VWCConfig.JWT_TOKEN_PREFIX, "").trim();
        return token;
    }

    // ---------------------------------------------
    // 受信したトークンの検証
    // ---------------------------------------------
    public static verifyToken(token: string): string {
        let ret;
        try {
            ret = jwt.verify(
                token,
                TokenKey.PUBLIC,
                { algorithms: ["RS256"]}
            );
        } catch (e) {
            console.error("### トークンの検証に失敗しました: " + e.message);
            return null;
        }
        console.log("### トークンの検証に成功しました");
        return ret;
    }

    // ---------------------------------------------
    // トークンからユーザ情報を取得
    // ---------------------------------------------
    public static extractUserFromToken(token): User {
        delete token.iat;
        delete token.exp;
        return token;
    }
}