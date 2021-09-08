/*
股票收益功能
本文件提供目前股票池中的收益。
 */

import {template} from "../../../bot";
import {stocks} from "stock-api";
import Interceptor from "../../Interceptor";
import * as fs from 'fs'

template.add("stock.success", "股票收益：<br/>{content}<br/>")


const stockInterceptor = new Interceptor("#股票收益")
    .alias("收益")
    .check(message => {
        if (/^#股票收益/.test(message.text())) {
            return true
        }
    })
    .handler(async (message, checkerArgs: { arg: string | undefined }) => {
        let stockpool = JSON.parse(fs.readFileSync('./stocks.json', 'utf-8'))
        for (let i = 0; i < stockpool.length; ++i) {
            const data = await stocks.sina.searchStocks(stockpool[i].code);
            if (data.length != 1) {
                for (let j = 0; j < data.length; ++j) {
                    if (data[j].name == stockpool[i].name) {
                        stockpool[i].now = data[j].now
                        stockpool[i].percent = (data[j].now - stockpool[i].price) / stockpool[i].price*100;
                    }
                }
            } else {
                stockpool[i].now = data[0].now
                stockpool[i].percent = (data[0].now - stockpool[i].price) / stockpool[i].price*100;
            }
        }
        stockpool = stockpool.sort((x, y) => x.end ? -1 : 1)
        let content = ''
        for (let i = 0; i < stockpool.length; i++) {
            let stock = stockpool[i];
            content += `${stock.name}【${stock.code}】: 现价${stock.now},收益率${stock.percent ? stock.percent.toFixed(2) : ''}%, 推荐日期${stock.first_date}${stock.end ? ',止盈' : ''} <br/>`
        }

        return template.use("stock.success", {
            content: content
        })

    })
export default stockInterceptor
