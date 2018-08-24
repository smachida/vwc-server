import * as fetch from "isomorphic-fetch";

const url = "http://localhost:3000/auth";
const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMCwibmFtZSI6IuWxseeUsOOAgOWkqumDjiIsInJvbGUiOiJ1c2VyIiwiZGVwdCI6IumWi-eZuiIsImlhdCI6MTUzNTExODE2NSwiZXhwIjoxNTM1MTI1MzY1fQ.LsXOsr_VT12xQDhs3kJoJM84u9pHeVpMdK6BtbeQufKEKb9acS2C5dRf-IW7dS7mlPOIPRxcK95fdGpL7DcLccG9cMIK6o0CSnJNV7SKm6WWsmTx9DZjQWzRfu4GdVY0Z6wAbGrr28ZQUY3dVKvKJlNFRsfuE7cbJ6dCW7BN0muxMoBqyGznGJCL1hH94Kec8jAP_KnkJNO7ri_cSA3OxDSfLjrch6XztRUqh1JbqsP_6OrE1XKFJpLYyVNXutjsxtxp2Zod0orQwN7zGbzIZHozE-SBNVYJ5sne6rxBct2qEMR7pF4FWGkLvva9T8GPO-I-yTta-2GJmKVb3E3msA";


let param: any = {};
param.method = "POST";

// HTTP ヘッダ
param.headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "cache": "no-cache"
}

// HTTP ボディの設定
param.body = JSON.stringify({token: token});

// 認証リクエストの送受信
fetch(url, param)
.then((obj) => {
    return obj.json();
}).then((obj) => {
    console.log(JSON.stringify(obj));
});