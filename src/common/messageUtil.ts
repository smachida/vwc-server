import {Request, Response, NextFunction} from "express";
import {ResponseMessage} from "../model/responseMessage";

// APIレスポンスのメッセージを生成
export class MessageUtil {

    public static sendResponse(res: Response, succeeded = false, message = "", data = null) {
        const responseMessage:ResponseMessage = {
            succeeded: succeeded,
            message: message,
            data: data
        };
        res.set("Cache-Control", "no-cache").json(responseMessage);
    }
}