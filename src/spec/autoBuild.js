//ファイルの変更を検出したときはWebサーバー再起動
//第一引数　監視対象フォルダ
//第二引数　監視対象ファイル拡張子
const WATCH_PATH = "./src/"|| process.argv[2];
const FILE_EXTENSION = "ts" || process.argv[3];
const fs = require("fs");
const rimraf = require("rimraf");
const tsc = require("typescript");
const child_process = require('child_process');
const execSync = child_process.execSync;
const spawn = child_process.spawn;
var childProc = null;
var isChangeDetect = true;
var isReadyServer = false;

//起動時
init = () => {
  isChangeDetect = false;
  build();
};

//ファイル変更検出時
onFileChange = (eventType, filename) => {
  if (!isChangeDetect) return;
  var arr = filename.split(".");
  var ext = arr[arr.length - 1];
  if (ext === FILE_EXTENSION &&
    eventType === "change") {
    console.log((new Date()).toLocaleTimeString() +
      " ファイルの変更を検出: " + filename);
    isChangeDetect = false;
    if (isReadyServer) {
      stopServer()
        .then(() => {
          build();
        })
    } else {
      build();
    }
  }
};

//サーバー停止
stopServer = () => {
  console.log("@@@stop server");
  return new Promise((resolve, reject) => {
    childProc.on("exit", function (code) {
      console.log("@@@サーバー停止" + code);
    });
    childProc.on("close", function (code) {
      console.log("@@@通信切断" + code);
      isReadyServer = false;
      resolve();
    });
    childProc.kill("SIGINT");
  });
};

//サーバー起動
startServer = () => {
  console.log("@@@start server");
  let chunks = [];
  return new Promise((resolve, reject) => {
    //非同期で子プロセスを生成
    childProc = spawn("node", ["./dist/server.js"], {encoding: "utf-8"});
    childProc.stdout.on("data", (chunk) => {
      chunks.push(chunk.toString());
      let str = chunk.toString("UTF-8");
      console.log("@@@" + str);
      if (str.indexOf("3000番ポートで待機中") !== -1) {
        isReadyServer = true;
        isChangeDetect = true;
        resolve(str);
      } else {
        reject();
      }
    });

    //エラー発生時
    childProc.stderr.on("data", (data) => {
      console.log("@@@" + data.toString());
      reject();
    });
  })
};

//ビルド後にサーバー起動
build = () => {
  console.log("@@@start build");
  //同期で子プロセス生成
  execSync("npm run build");
  startServer()
    .then(() => {
      isChangeDetect = true;
    });
};

//起動処理呼び出し
init();

//ファイル変更の監視を開始
fs.watch(WATCH_PATH,
  {persistent: true, recursive: true},
  onFileChange);

