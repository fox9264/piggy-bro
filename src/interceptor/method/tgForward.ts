import {template, wechaty} from "../../bot";
import Interceptor from "../Interceptor";
import {Room} from "wechaty";
import {Contact} from "wechaty";
import parser from "fast-xml-parser"
import decode from "unescape"
let forward_room: Room = null
import fs from "fs"
import * as tencentcloud from "tencentcloud-sdk-nodejs";
function formatDate(){
    //三目运算符
    const Dates = new Date();

    //年份
    const Year : number = Dates.getFullYear();

    //月份下标是0-11
    const Months : any = ( Dates.getMonth() + 1 ) < 10  ?  '0' + (Dates.getMonth() + 1) : ( Dates.getMonth() + 1);

    //具体的天数
    const Day : any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();

    //小时
    const Hours = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();

    //分钟
    const Minutes = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();

    //秒
    const Seconds = Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();

    //返回数据格式
    return Year + '-' + Months + '-' + Day + '-' + Hours + ':' + Minutes + ':' + Seconds;
}
const tgForward = new Interceptor("tgForward")
    .check(async message => {
        const talker = message.talker() // 发消息人
        const content = message.text() // 消息内容
        const room = message.room() // 是否是群消息
        const type = await message.type()
        let topic = ''
        if(room) {
            topic = await room.topic()
        }

        if (topic === '华证转发') {
            forward_room = room
        }
        if (topic.indexOf('Super投顾交流群') !== -1) {
            if (forward_room !== null) {
                if (type === 7) {
                    await forward_room.say(`[${talker.name()}@Super投顾交流群]： ${content} `)
                } else if (type === 1) {
                    let text = message.text()
                    let xml = decode(text)
                    let jsonObj = parser.parse(xml)
                    let url = jsonObj.msg.appmsg.url
                    let title = jsonObj.msg.appmsg.title
                    if (url) {
                        await forward_room.say(`[${talker.name()}@Super投顾交流群]： ${title} | ${url} `)
                    } else {
                        await forward_room.say(`[${talker.name()}]：`)
                        await message.forward(forward_room)
                    }
                } else if(type ===2){
                    let now = formatDate()
                    const audioFileBox = await message.toFileBox();
                    const audioData: Buffer = await audioFileBox.toBuffer();
                    // audioData: silk 格式的语音文件二进制数据
                    const clientConfig = {
                        // 腾讯云认证信息
                        credential: {
                            secretId: "id",
                            secretKey: "key",
                        },
                        // 产品地域
                        region: "ap-beijing",
                        // 可选配置实例
                        profile: {
                            signMethod: "HmacSHA1", // 签名方法
                            httpProfile: {
                                reqMethod: "POST", // 请求方法
                                reqTimeout: 30, // 请求超时时间，默认60s
                            },
                        },
                    }
                    // @ts-ignore
                    let client = new tencentcloud.asr.v20190614.Client(clientConfig)
                    let task = {
                        EngineModelType: "16k_zh",
                        ChannelNum: 1,
                        ResTextFormat: 1,
                        SourceType: 1,
                        SpeakerDiarization : 0,
                        /**
                         * 语音数据，当SourceType 值为1时必须填写，为0可不写。要base64编码(采用python语言时注意读取文件应该为string而不是byte，以byte格式读取后要decode()。编码后的数据不可带有回车换行符)。音频数据要小于5MB。
                         */
                        Data: audioData.toString("base64"),

                        /**
                         * 数据长度，非必填（此数据长度为数据未进行base64编码时的数据长度）。
                         */
                        DataLen: audioData.length
                    }
                    let resp = await client.CreateRecTask(task)
                    let tryTime = 0
                    let intervalId = setInterval(async function () {
                        let recog = await client.DescribeTaskStatus({TaskId: resp.Data.TaskId})
                        if(recog.Data.StatusStr == "success") {
                            clearInterval(intervalId)
                            await forward_room.say(`[${talker.name()}@Super投顾业务交流群]：[语音信息 ${now}]` + recog.Data.ResultDetail.map(x => x.FinalSentence).reduce((x, y) => x+y, ""))
                            audioFileBox.name = `[${talker.name()}@Super投顾业务交流群]-${now}.mp3`
                            await forward_room.say(audioFileBox)
                        }
                        tryTime += 1
                        if(tryTime > 60) {
                            clearInterval(intervalId)
                        }
                    }, 500)

                }else if(type === 6){
                    await forward_room.say(`[${talker.name()}@Super投顾交流群]：Image`)
                    await message.forward(forward_room)
            }else {
                    await forward_room.say(`[${talker.name()}@Super投顾交流群]：`)
                    await message.forward(forward_room)
                }
            if(room) {
                return true
            }
        }
        }

    })
export default tgForward
