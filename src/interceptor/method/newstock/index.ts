/*
查新股功能
本文件提供查新股的实现。
 */
import {template} from "../../../bot";
import Interceptor from "../../Interceptor";
import Axios, {AxiosResponse} from "axios";
import {FileBox} from "wechaty";
template.add("newstock.success", "{content}")

const newstockInterceptor = new Interceptor("#今日新股")
    .alias("#新股")
    .check(message => {
        if (/^#今日新股/.test(message.text())) {
            return true
        }
    })
    .handler(async (message, checkerArgs: { arg: string | undefined }) => {
        const axios = Axios.create();
        let sg_content = ''
        let ss_content = ''
        await axios.get("https://data.eastmoney.com/xg/xg/calendar.html").then(resp => {
            let data = JSON.parse(JSON.stringify(resp.data))
            let start_idx = data.indexOf("pagedata")
            let temp_data = data.substr(start_idx)
            let end_idx = temp_data.indexOf("</script>")
            temp_data = temp_data.substring(0, end_idx)
            start_idx = temp_data.indexOf("{")
            temp_data = temp_data.substring(start_idx)
            let object = JSON.parse(temp_data.replace(";", ""))
            data = object.calendardata.result.data;
            for (let i=0;i<data.length;i++){
                if(data[i].TRADE_DATE==data[i].SYS_DATE){
                    if(data[i].DATE_TYPE=="申购"){
                        sg_content += `${data[i].SECURITY_NAME_ABBR}(${data[i].SECURITY_CODE}) `+" "
                    }
                    if(data[i].DATE_TYPE=="上市"){
                        ss_content += `${data[i].SECURITY_NAME_ABBR}(${data[i].SECURITY_CODE})`+" "
                    }
                }
            }

        })
        let content =''
        content =`华融证券今日可转债/新股申购上市提示：${sg_content}申购，${ss_content}上市，华融证券祝您投资顺利！`

        return template.use("newstock.success", {
            content: content
        })
    })
export default newstockInterceptor