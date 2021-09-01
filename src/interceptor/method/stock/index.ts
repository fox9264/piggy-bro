/*
查天气功能
本文件提供查天气功能的实现，默认提供的是 彩云天气 API实现。
 */

import {template} from "../../../bot";

// template.add("weather.location.unknown", "二师兄不知道你说的是哪里，确认一下？")
template.add("stock.success", "{name}({no})：<br/>{price}, {detail}<br/>")

// 将具体实现引用放在后面，就可以在该引用文件里使用 template.set 来修改默认的返回值
import caiyunWeather, {dressingDict, skyconDict, toAqiDesc, ultravioletDict} from "./caiyunapi";
import {place} from "../../../lib/APIs/CaiyunAPI";
import Interceptor from "../../Interceptor";

const stockInterceptor = new Interceptor("买啥股票")
    .alias("买股票")
    .check(message => {
        if (/^买啥股票/.test(message.text())) {
            return true
        }
    })
    .handler(async (message, checkerArgs: { arg: string | undefined }) => {
        // const { arg } = checkerArgs
        // if (!arg) return template.use("weather.location.unknown")
        // else {
            // const location = await place(arg)
            // const data = await caiyunWeather(location.location.lng, location.location.lat)
        return template.use("stock.success", {
            name: '中泰化学',
            no: "002092",
            price: 11.843,
            detail: '抓紧买，已经涨停！'

        })
        // }
    })
export default stockInterceptor
