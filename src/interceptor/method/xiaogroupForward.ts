import {template} from "../../bot";
import Interceptor from "../Interceptor";
import {Room} from "wechaty";
import {Contact} from "wechaty";
import parser from "fast-xml-parser"
import decode from "unescape"
import fs from "fs";
let forward_room: Room = null

const xiaogroupForward = new Interceptor("xiaogroupForward")
    .check(async message => {
        const talker = message.talker() // 发消息人
        const content = message.text() // 消息内容
        const room = message.room() // 是否是群消息
        const type = await message.type()
        let topic = ''
        if(room) {
            topic = await room.topic()
        }

        if (topic === '镰刀') {
            forward_room = room
        }
        if (topic.indexOf('通知群') !== -1 ) {
            if (forward_room !== null) {
                if (type === 7) {
                    await forward_room.say(`${content}  `)
                } else if (type === 1) {
                    let text = message.text()
                    let xml = decode(text)
                    let jsonObj = parser.parse(xml)
                    let url = jsonObj.msg.appmsg.url
                    let title = jsonObj.msg.appmsg.title
                    if (url) {
                        await forward_room.say(` ${title} | ${url} `)
                    } else {
                        await message.forward(forward_room)
                    }
                } else {
                    await message.forward(forward_room)
                }
            }
            if(room) {
                return true
            }
        }
        if (topic.indexOf('融慧点金交流群') !== -1) {
            let grp_name = "融慧点金"
            if (forward_room !== null) {
                if (type === 7) {
                    await forward_room.say(`[${talker.name()}@融汇点金]： ${content} `)
                } else if (type === 1) {
                    let text = message.text()
                    let xml = decode(text)
                    let jsonObj = parser.parse(xml)
                    let url = jsonObj.msg.appmsg.url
                    let title = jsonObj.msg.appmsg.title
                    if (url) {
                        await forward_room.say(`[${talker.name()}@融慧点金]： ${title} | ${url} `)
                    } else {
                        await forward_room.say(`[${talker.name()}]：`)
                        await message.forward(forward_room)
                    }
                }else if(type ===2){
                    const audioFileBox = await message.toFileBox();
                    const audioData: Buffer = await audioFileBox.toBuffer();
                    // audioData: silk 格式的语音文件二进制数据
                    await forward_room.say(`[${talker.name()}@融汇点金]：`)
                    await forward_room.say(audioFileBox)

                }else if(type === 6){
                    await forward_room.say(`[${talker.name()}@融汇点金]：Image`)
                    await message.forward(forward_room)
                }else {
                    await forward_room.say(`[${talker.name()}@融汇点金]：`)
                    await message.forward(forward_room)
                }
            }
            if(room) {
                return true
            }
        }


    })
export default xiaogroupForward
