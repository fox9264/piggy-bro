import {template} from "../../../bot";
import Interceptor from "../../Interceptor";
const basePicture = "./img/bg.png";
import {FileBox} from "wechaty";
import addText from "./topicapi";
import fs from "fs";

template.add("topicture.success", "{content}")
const topictureInterceptor = new Interceptor("#收益图")
    .check(async message => {
        if (/^#收益图/.test(message.text())) {
            let stockpool = JSON.parse(fs.readFileSync('./stocks.json', 'utf-8'))
            let top_num = 1234
            // let text_color='red'
            // for(let i =0;i<stockpool.length;i++){
            //     if(stockpool[i].percent<0){
            //         text_color='green'
            //     }
            // }
            await addText(
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
            return true
        }
    })
    .handler(async (message, checkerArgs: { arg: string | undefined }) => {

        const  fileBox = FileBox.fromFile('./img/bg1.png')
        await message.say(fileBox)
        return template.use("topicture.success", {
            content:"温馨提示：切勿追涨杀跌！"
        })

    })

export default topictureInterceptor