import {template} from "../../bot";
import Interceptor from "../Interceptor";
import {Room} from "wechaty";
import {Contact} from "wechaty";
import parser from "fast-xml-parser"
import decode from "unescape"
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
        }
        if (topic.indexOf('融慧点金交流群') !== -1) {
            let grp_name = "3"
            if (forward_room !== null) {
                if (type === 7) {
                    await forward_room.say(`【${talker.name()}】说： ${content}  【来自${grp_name}群】`)
                } else if (type === 1) {
                    let text = message.text()
                    let xml = decode(text)
                    let jsonObj = parser.parse(xml)
                    let url = jsonObj.msg.appmsg.url
                    let title = jsonObj.msg.appmsg.title
                    if (url) {
                        await forward_room.say(`【${talker.name()}】说： ${title} | ${url} 【来自${grp_name}群】`)
                    } else {
                        await forward_room.say(`【${talker.name()}】说：  `)
                        await message.forward(forward_room)
                    }
                } else {
                    await forward_room.say(`【${talker.name()}】说：  `)
                    await message.forward(forward_room)
                }
            }
            if(room) {
                return true
            }
        }


    })
export default xiaogroupForward
