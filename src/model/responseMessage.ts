// APIレスポンスのデータ型
export interface ResponseMessage {
    succeeded: boolean;    // 処理結果 true | false
    message: string;       // 処理ステータス表示用のメッセージ
    data: any;             // レスポンスデータの本体
}
