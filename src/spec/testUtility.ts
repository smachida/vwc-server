import * as fetch from "isomorphic-fetch";
import {Const} from "./testConst";

export class TestUtility {

    public static request(url: USVString, setParam: RequestInit): Promise<any> {
        return new Promise((resolve, reject) => {
            let response;
            let bodyObj;
            // 通信パラメータの設定
            let defaultParam: RequestInit;
            const method = setParam.method.toUpperCase();
            // メソッドに応じたHTTPヘッダを設定
            if (method === "POST" || method === "PUT") {
                defaultParam = {headers: Const.WITHBODY_HEADERS};
            } else {
                defaultParam = {headers: Const.NOBODY_HEADERS};
            }
            // デフォルトのヘッダ値と引数で指定された値をマージ
            const mergeHeaders = {
                ...defaultParam.headers,
                ...setParam.headers
            };
            delete setParam.headers;
            const param: RequestInit = {...defaultParam, ...setParam};
            if (param.body) {
                param.body = JSON.stringify(param.body);
            }
            param.headers = mergeHeaders;

            // fetch APIの呼び出し
            fetch(url, param)
                .then((obj) => {
                    response = obj;
                    return response.json();
                })
                .then((obj) => {
                    bodyObj = obj;
                    // レスポンスデータを呼び出し元へ返す
                    resolve({
                        body: bodyObj,
                        cookie: response.headers.get("set-cookie"),
                        data: bodyObj.data,
                        headers: response.headers,
                        ok: response.ok,
                        response,
                        status: response.status,
                    });
                })
                .catch((e)=>{
                    reject(e);
                });
        });
    }

    // 第１引数のオブジェクトが、第２引数で指定したプロパティを持つことを確認
    public static checkProperties(obj, ref) {
        expect(Object.keys(obj).sort()).toEqual(ref.sort());
    }

}
