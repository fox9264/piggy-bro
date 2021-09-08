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
        let row_left = 285
        let row = [i.name, i.code, i.now, i.price, i.first_date.substring(i.first_date.length - 5), i.percent.toFixed(2) + "%"]
        let color = content[i].color ? content[i].color : 'black'
        for (let i = 0; i < row.length; i++) {
            if (i === 0) {
                row_left = 285
            } else if (i === 1) {
                row_left = 458
            } else if (i === 2) {
                row_left = 616
            } else if (i === 3) {
                row_left = 748
            } else if (i === 4) {
                row_left = 865
            } else {
                row_left = 988
            }
            let opt = {
                ...options,
                attributes: {
                    ...options.attributes,
                    fill: color,
                }
            }
            texts.push({
                input: Buffer.from(textToSvgSync.getSVG(row[i].toString(), opt)),
                top,
                left: row_left
            })
        }
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
