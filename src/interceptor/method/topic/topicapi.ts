import {stocks} from "stock-api";

const sharp = require('sharp');
const textToSvg = require('text-to-svg');
export default async function addText(basePicture, font, newFilePath, content) {
    const {fontSize, text, color} = font;
    const textToSvgSync = textToSvg.loadSync('./fonts/STKAITI.TTF');
    const attributes = {
        fill: color
    };
    const options = {
        fontSize,
        anchor: 'top',
        attributes
    };
    let texts = []
    let top = 1130
    for (let i of content) {
        const data = await stocks.sina.searchStocks(i.code);
        if (data.length != 1) {
            for (let j = 0; j < data.length; ++j) {
                if (data[j].name == i.name) {
                    i.now = data[j].now
                    i.percent = ((data[j].now - i.price) / i.price * 100);
                    if (i.percent < 0) {
                        i.color_flag = 'green'
                    } else {
                        i.color_flag = 'red'
                    }
                }
            }
        } else {
            i.now = data[0].now
            i.percent = ((data[0].now - i.price) / i.price * 100);
            if (i.percent < 0) {
                i.color_flag = 'green'
            } else {
                i.color_flag = 'red'
            }

        }
        top += 60
        let row = [i.name, i.code, i.now, i.price, i.first_date.substring(i.first_date.length - 5), i.percent.toFixed(2) + "%"]
        let color = i.color_flag ? i.color_flag : 'black'
        let opt = {
            ...options,
            attributes: {
                ...options.attributes,
                fill: color,
            }
        }
        const writeLine = (row: string[]) => {
            let offset = [285, 458, 616, 748, 865, 988];
            row.forEach((column, index) => {
                texts.push({
                    input: Buffer.from(textToSvgSync.getSVG(column.toString(), opt)),
                    top,
                    left: offset[index]
                })
            })
        }
        writeLine(row);
    }
    await sharp(basePicture)
        .composite(texts)
        .withMetadata()
        .png()
        .toFile(newFilePath)
        .catch(err => {
            console.log(err)
        });

}
