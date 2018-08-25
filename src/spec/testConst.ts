// APIテスト用定数
export class Const {

    // テスト対象のサーバURL
    public static BASE_URL = "http://localhost:3000";

    // ユーザー権限でのログイン時のユーザIDとパスワード
    public static USER_LOGIN_DATA = {
        password: "password",
        userId: "tyamada",
    };

    //  HTTPリクエストにBodyがある場合に設定するHTTPヘッダ
    public static WITHBODY_HEADERS = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "cache": "no-cache",
    };
    //  HTTPリクエストにBodyが無い場合に設定するHTTPヘッダ
    public static NOBODY_HEADERS = {
        Accept: "application/json",
        cache: "no-cache",
    };
}
