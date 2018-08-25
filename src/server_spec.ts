// server.ts のテストシナリオ
import * as fetch from "isomorphic-fetch";

describe("Ping API テスト", () => {
   const BASE_URL = "http://localhost:3000";
   const requestParams: RequestInit = {
       method: "GET",
       headers: {
           "Accept": "application/json",
           "cache": "no-cache"
       }
   };

   it("正常動作テスト", () => {
       // 期待値
       const refObj = { message: "/pingのリクエストを受け付けました"};

       const url = BASE_URL + "/ping";

       // リクエスト実行
       fetch(url, requestParams)
           .then((obj) => {
               return obj.json();
           })
           .then((obj) => {
               expect(obj).toEqual(refObj);
	       //done();
           })
           .catch((e) => console.error(e.message));
   });

   it("URL不一致テスト", (done) => {
       // 期待値
       const refObj = { message: "不正なパスに対するリクエスト"};

       const url = BASE_URL + "/invalid";

       // リクエスト実行
       fetch(url, requestParams)
           .then((obj) => {
               return obj.json();
           })
           .then((obj) => {
               expect(obj).toEqual(refObj);
               done();
           })
           .catch((e) => console.error(e.message));
   });
});
