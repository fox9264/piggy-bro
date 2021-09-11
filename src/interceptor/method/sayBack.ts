import {template} from "../../bot";
import Interceptor from "../Interceptor";
import {Room} from "wechaty";
let forward_room: Room = null

const sayBack = new Interceptor("sayBack")
    .check(async message => {
        const talker = message.talker() // 发消息人
        const content = message.text() // 消息内容
        const room = message.room() // 是否是群消息
        const type = await message.type()
        let topic = ''
        if(room) {
            topic = await room.topic()
        }

        if (topic === '融慧点金交流群') {
            forward_room = room
        }
        let vip_list = ['张恒']
        if (topic.indexOf('镰刀') !== -1 && forward_room)  {
            if (content.startsWith("#问股票") && vip_list.indexOf(talker.name()) !== -1) {
                forward_room.say("刘老师," + content.replace("#问股票", "").trim())
                room.say("消息已经转发，等待回复")
            }
        }
    })
export default sayBack
