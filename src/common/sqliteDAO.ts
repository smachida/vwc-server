import * as path from "path";
import * as sqlite3 from "sqlite3";
import { VWCConfig } from "./vwcConfig";

// DBアクセスクラス
export class SqliteDAO {

    // DB
    private static db: any;


    // CRUD 処理

    // ---------------------------------------------
    // C: 追加
    // ---------------------------------------------
    public static insert(sql, param): Promise<string> {
        return new Promise((resolve, reject) => {
            SqliteDAO.db.run(sql, param, (err) => {
                if (err) {
                    console.error("レコードの追加に失敗しました: " + err.message);
                    process.exit(1);
                }
                console.log("レコードの追加に成功しました: " + sql.toLocaleString());
                return resolve("success");
            });
        });
    }

    // ---------------------------------------------
    // R: 検索
    // ---------------------------------------------
    public static select(sql, param): Promise<any> {
        return new Promise((resolve, reject) => {
            const data = [];
            param = param || [];
            SqliteDAO.db.each(sql, param,
                (err, row) => data.push(row),
                (err, count) => {
                    if (err) {
                        console.error("レコードの検索に失敗しました: " + err.message);
                        process.exit(1);
                    }
                    console.log("レコードの検索に成功しました: " + count + " 件");
                    return resolve({rows: data});
                });
        });
    }

    // ---------------------------------------------
    // U: 更新
    // ---------------------------------------------
    public static update(sql, param): Promise<string> {
        return new Promise((resolve, reject) => {
            SqliteDAO.db.run(sql, param, (err) => {
                if (err) {
                    console.error("レコードの更新に失敗しました: " + err.message);
                    process.exit(1);
                }
                console.log("レコードの更新に成功しました: " + sql.toLocaleString());
                return resolve("success");
            });
        });
    }

    // ---------------------------------------------
    // D: 削除
    // ---------------------------------------------
    public static delete(sql, param): Promise<string> {
        return new Promise((resolve, reject) => {
            SqliteDAO.db.run(sql, param, (err) => {
                if (err) {
                    console.error("レコードの削除に失敗しました: " + err.message);
                    process.exit(1);
                }
                console.log("レコードの削除に成功しました: " + sql.toLocaleString());
                return resolve("success");
            });
        });
    }

    // ライフサイクル処理(オープン/クローズ)

    // ---------------------------------------------
    // ライフサイクル: 初期化
    // ---------------------------------------------
    public static init() {
        SqliteDAO.onBeforeExit();
        SqliteDAO.open();
    }

    // ---------------------------------------------
    // ライフサイクル: DBクローズ
    // ---------------------------------------------
    private static onBeforeExit() {
        // イベントハンドラの登録
        process.on("beforeExit", () => {
            this.close();
        });
    }

    // ---------------------------------------------
    // ライフサイクル: DBオープン
    // ---------------------------------------------
    private static open() {
        const dbFile = path.resolve("") + VWCConfig.SQLITE_DB_PATH;
        SqliteDAO.db = new sqlite3.Database(
            dbFile,
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) {
                    console.error("データベースのオープンに失敗しました: " + err.message);
                    process.exit(1);
                } else {
                    console.log("データベースに接続しました。");
                }
            }
        );
    }

    // ---------------------------------------------
    // ライフサイクル: DBクローズ
    // ---------------------------------------------
    private static close(): void {
        console.log("データベースをクローズしています・・・");
        SqliteDAO.db.close();
        console.log("データベースをクローズしました。");
    }

}