// Virtual Wine Cellar Server の設定情報
export class VWCConfig {
    // -------------------------------------
    // 1. Express サーバ設定
    // -------------------------------------

    // サーバの待機ポート番号
    public static PORT_NUMBER  = 3000;
    // 受信データの最大サイズ
    public static MAX_REQUEST_SIZE = 50000000;

    // -------------------------------------
    // 2. API 関連
    // -------------------------------------

    // ユーザ用 API接続先
    public static USER_API_ENDPOINT_URL = "/api/v1/";
    // 管理者用 API接続先
    public static ADMIN_API_ENDPOINT_URL = "/api/v1/admin/";

    // -------------------------------------
    // 3. トークン関連
    // -------------------------------------

    // 生成するトークンの有効期限(sec) (デフォルトは24時間)
    public static JWT_TOKEN_TIMEOUT  = 24 * 3600;
    // JWTトークンのキー名
    public static JWT_TOKEN_HEADER = "authorization";
    // JWTトークンのプレフィックス
    public static JWT_TOKEN_PREFIX = "Bearer ";

    // -------------------------------------
    // 4. データベース関連
    // -------------------------------------

    // データベースファイルの置き場所(SQLite)
    public static SQLITE_DB_PATH = "/db/vwcserver.db";
}