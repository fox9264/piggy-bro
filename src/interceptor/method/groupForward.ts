import {template} from "../../bot";
import Interceptor from "../Interceptor";
import {Room} from "wechaty";
import parser from "fast-xml-parser"
import decode from "unescape"
let forward_room: Room = null

const groupForward = new Interceptor("groupForward")
    .check(async message => {
        const talker = message.talker() // 发消息人
        const content = message.text() // 消息内容
        const room = message.room() // 是否是群消息
        const type = await message.type()
        let topic = ''
        if(room) {
            topic = await room.topic()
        }

        if (topic === '通知群') {
            forward_room = room
        }
        if (topic.indexOf('华证投顾') !== -1 || topic.indexOf('锦鲤策长期') !== -1) {
            let grp_name = topic.indexOf('华证投顾') !== -1 ? '1' : '2'
            if (forward_room !== null) {
                if (type === 7) {
                    await forward_room.say(`【${message.talker().name()}】说： ${content}  【来自${grp_name}群】`)
                } else if (type === 1) {
                    let text = message.text()
                    let xml = decode(text)
                    let jsonObj = parser.parse(xml)
                    let url = jsonObj.msg.appmsg.url
                    let title = jsonObj.msg.appmsg.title
                    if (url) {
                        await forward_room.say(`【${message.talker().name()}】说： ${title} | ${url} 【来自${grp_name}群】`)
                    } else {
                        await forward_room.say(`【${message.talker().name()}】说：  `)
                        await message.forward(forward_room)
                    }
                } else {
                    await forward_room.say(`【${message.talker().name()}】说：  `)
                    await message.forward(forward_room)
                }
            }
        }
        if(room) {
            return true
        }
    })
export default groupForward
