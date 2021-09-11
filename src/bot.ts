import "./better-console"

import {Wechaty, Message, Room,Contact, Friendship} from "wechaty"
import qrcodeTerminal from "qrcode-terminal";

import path from "path"
import {mkdirSync} from "./lib/Util";
export const __data_dir = path.join(__dirname, "../data")
export const __interceptor_dir = path.join(__dirname, "./interceptor")
export const __build_dir = __dirname
export const __src_dir = path.join(__dirname, "../src")
mkdirSync(__data_dir)

import SqliteTemplate from "./lib/SqliteTemplate";
const sqliteTemplate = new SqliteTemplate(path.join(__data_dir, "./database.db"))
export {sqliteTemplate}

import CallLimiter from "./lib/CallLimiter";
const callLimiter = new CallLimiter(sqliteTemplate)
export {callLimiter}

import Template from "./lib/Template";
const template = new Template()
export {template}

// 给公共模板设置默认值
import "./template"
const args = require('minimist')(process.argv.slice(2))


// 启动http服务器
import server from "./server"
server()

// 引入拦截器
import {mp} from "./interceptor";

const wechaty = Wechaty.instance({
    name: args['name'] ,//joe,
    puppet: 'wechaty-puppet-wechat',

})
console.log(process.argv)
console.log(`Bot Name ${args['name']}`)
wechaty.on("scan", (qrcode, status) => {
    switch (status) {
        case 2:
            console.log(template.use("on.scan.link"))
            console.log(`https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
            // 生成二维码打印在屏幕上
            qrcodeTerminal.generate(qrcode, function (output) {
                console.log(template.use("on.scan.terminal", {
                    qrcode: output
                }))
            })
            break
        case 3:
            console.log(template.use("on.scan.confirm"))
            break
        case 4:
            console.log(template.use("on.scan.login"))
            break
        default:
            console.log(status, qrcode)
    }
})
wechaty.on("login", (user: Contact) => {
    console.log(template.use("on.login", {
        name: `\x1B[43m${user.name()}\x1b[0m`
    }))
})
wechaty.on("logout", (user: Contact) => {
    console.log(template.use("on.logout", {
        name: `\x1B[43m${user.name()}\x1b[0m`
    }))
})
wechaty.on("message", async (message: Message) => {
    if (message.self()) return
    await mp.process(message)
})


wechaty.on('friendship', async (friendship) => {
    if(args['name'] === 'bot1') {
        let logMsg
        try {
            logMsg = '添加好友' + friendship.contact().name()
            console.log(logMsg)

            switch (friendship.type()) {
                case Friendship.Type.Receive:
                    let addFriendReg = eval('/镰刀/i')
                    if (addFriendReg.test(friendship.hello())) {
                        logMsg = '自动添加好友，因为验证信息中带关键字‘镰刀’'
                        await friendship.accept()
                        await new Promise(r => setTimeout(r, 1000))
                        const contact = friendship.contact()
                        await contact.say("你好呀")

                    } else {
                        logMsg = '没有通过验证 ' + friendship.hello()
                    }
                    break
                case Friendship.Type.Confirm:
                    logMsg = 'friend ship confirmed with ' + friendship.contact().name()

                    break

            }

        } catch (e) {
            logMsg = e.message
        }
        console.log(logMsg)
    }
})

wechaty.on("room-join", async (room: Room, inviteeList: Contact[], inviter: Contact) => {
    if(args['name'] === 'bot1') {
        const nameList = inviteeList.map(c => c.name()).join(',')
        await new Promise(r => setTimeout(r, 800))
        if (await room.topic() == "镰刀") {
            await room.say(`欢迎新成员@${nameList}进群，发送#股票收益查看股票池。温馨提示：股票池中股票皆为中线股，不建议追高，如果没有买入建议回调时购买。`)
        }
        console.log(`Room got new member ${nameList}, invited by ${inviter}`)
    }
});
wechaty.on("error", async (error) => {
    console.error(template.use("on.error"))
    console.error(error)
})
wechaty.start().then(() => {
    console.log(template.use("on.start"))
})

export {wechaty}

const startAt = new Date()
export {startAt}
