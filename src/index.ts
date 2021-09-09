// 入口是守护程序，目的是让bot在意外结束时不至于直接被关闭
// 同时也支持运行多个bot实例
import ChildProcess from "child_process"
import Path from "path"
import "./better-console"
import addText from "./interceptor/method/topic/topicapi";
import fs from "fs";

// function createBot() {
//     const botProcess = ChildProcess.fork(Path.join(__dirname, "./bot"), process.argv)
//     botProcess.on("exit", function (code: number) {
//         console.log("机器人进程已退出，退出码：" + code)
//         if (code !== 0) {
//             console.log("正在重新启动……")
//             createBot()
//         }
//     })
//     botProcess.on("error", function (e) {
//         console.log("机器人进程发生错误：" + e)
//         console.log("正在重新启动……")
//         createBot()
//     })
// }
// createBot()
const basePicture = "./img/bg.png";
let stockpool = JSON.parse(fs.readFileSync('./stocks.json', 'utf-8'))
let top_num = 1234
addText(
    basePicture,
    {
        fontSize: 30,
        color: 'red',
        left: 270,
        top: top_num
        //1340-1250 = 90
    },
    './img/bg1.png',
    stockpool
);
