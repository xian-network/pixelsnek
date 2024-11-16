import { decodeFrames, letter_to_color } from "../../../js/utils.js";
import GIFEncoder2 from 'gif-encoder-2'
import { createCanvas, registerFont } from 'canvas';
import { error } from '@sveltejs/kit';

process.env.FONTCONFIG_PATH = '/etc/fonts'
registerFont('../frontend/src/fonts/Roboto-Medium.ttf', { family: 'Roboto' })

import { config } from '../../../js/config.js'
import { getThingByUid } from '../../../js/graphqlQueries.js'
import { fetchThings } from '../../../js/processGraphql.js'

function createGIF(thingInfo, shareLink = false) {
    return new Promise((resolve, reject) => {
        try {
            let pixelSize = 30;
            let numOfPixels = config.frameWidth
            let watermark = { fillColor: "#000000000", strokeColor: "#000000000" }
            const canvas = createCanvas(numOfPixels * pixelSize, numOfPixels * pixelSize);
            let ctx = canvas.getContext("2d");
            let frames = decodeFrames(thingInfo.thing)

            let encoder = new GIFEncoder2(canvas.width, canvas.height, 'neuquant', true, frames.length);
            
            // Create array to store chunks of GIF data
            const chunks = [];
            
            // Create stream and collect chunks
            const stream = encoder.createReadStream();
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);

            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(0);
            encoder.setQuality(50);
            encoder.setThreshold(0);
            // encoder.setTransparent(0x00FF15)

            frames.forEach((frame, index) => {
                if (index <= frames.length) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    frame.forEach((letter, index) => {
                        if (letter === "A") ctx.fillStyle = "#00ff15"
                        else ctx.fillStyle = letter_to_color[letter];
                        ctx.fillStyle = letter_to_color[letter];
                        let rowBefore = Math.floor(index / numOfPixels)
                        let rowAdj = (pixelSize * rowBefore)
                        let y = Math.floor(index / numOfPixels)
                        let x = (index - (y * numOfPixels)) * pixelSize
                        ctx.fillRect(x, rowAdj, pixelSize, pixelSize);

                        if (!shareLink) {
                            ctx.font = `48pt Roboto`;
                            ctx.textBaseline = 'middle';
                            ctx.textAlign = 'center';
                            ctx.strokeStyle = watermark.strokeColor;
                            ctx.lineWidth = 1;
                            ctx.miterLimit = 2;
                            ctx.strokeText('', canvas.width / 2, canvas.height - (canvas.height / 7));
                            ctx.fillStyle = watermark.fillColor;
                            ctx.fillText('', canvas.width / 2, canvas.height - (canvas.height / 7));
                        }
                    })
                    encoder.addFrame(ctx);
                }
            })
            encoder.finish();
        } catch (err) {
            reject(err);
        }
    });
}

export async function GET({ params }) {
    try {
        const things = await fetchThings(getThingByUid(params.uid));
        if (!things.length) {
            throw error(404, 'GIF not found');
        }

        const gifBuffer = await createGIF(things[0]);

        return new Response(gifBuffer, {
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (err) {
        console.error(err);
        throw error(500, 'Error generating GIF');
    }
}