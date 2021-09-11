import {MessageProcessor} from "../lib/MessageProcessor";
import {template} from "../bot";

const args = require('minimist')(process.argv.slice(2))

const mp = new MessageProcessor()
mp.on("error", (message, error) => {
    if (error.message === "ERR_CANNOT_GET_KEY")
        return template.use("error.api.key.missing")
    else if (error.message === "ERR_CALL_LIMIT")
        return template.use("error.api.call.limit")
    else if (error.message === "ERR_CALL_NO_PERMISSION")
        return template.use("error.api.call.no_permission")
    else {
        console.error(template.use("on.error"))
        console.error(error)
        return template.use("error.unknown")
    }
})

// import help from "./method/help"
// import hello from "./method/hello"
// import idiom from "./method/idiom"
// import joke from "./method/joke"
// import weibo from "./method/weibo"
// import weather from "./method/weather"
// import neteaseCloudMusic from "./method/netease-cloud-music"
// import wordPuzzle from "./method/word-puzzle";
import topictureInterceptor from "./method/topic";
import groupForward from "./method/groupForward";
import stockInterceptor from "./method/stock";
import newstockInterceptor from "./method/newstock";
import xiaogroupForward from "./method/xiaogroupForward";
import tgForward from "./method/tgForward";
import sayback from "./method/sayBack"

if(args['name']==="bot1"){
    mp.interceptor(sayback)
    mp.interceptor(topictureInterceptor)
    mp.interceptor(stockInterceptor)
    mp.interceptor(newstockInterceptor)
    mp.interceptor(xiaogroupForward)
}else{
    mp.interceptor(groupForward)
    mp.interceptor(tgForward)
}

// mp.interceptor(help)
// mp.interceptor(hello)
// mp.interceptor(idiom)
// mp.interceptor(joke)
// mp.interceptor(weibo)
// mp.interceptor(weather)
// mp.interceptor(neteaseCloudMusic)
// mp.interceptor(wordPuzzle)

export {mp}
