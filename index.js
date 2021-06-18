const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');
const childProcess = require('child_process');
const cwebp = require('cwebp-bin');
const path = require('path');

function handleProcess(process) {
    console.log("handleProcess");
    console.dir(process);
    return new Promise((resolve, reject) => {
        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            console.log('stdout');
        });

        process.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
}

const handler = async (event, ) => {
    let body = event;
    if (body) {
        if (body.base64) {
            try {

                let tmp = '/tmp/';

                if (!fs.existsSync(tmp)) {
                    tmp = __dirname;
                }

                const uuid = uuidv4();;
                const sourceFilename = path.resolve(tmp + uuid + '.png');
                const targetFilename = path.resolve(tmp + uuid + '.webp');
                console.log(sourceFilename);
                console.log(targetFilename);

                fs.writeFileSync(sourceFilename, body.base64, 'base64', );

                console.log('handleProcess- start');

                await handleProcess(childProcess.spawn(cwebp, [sourceFilename, '-o', targetFilename, '-q', body.quality || '80']))
                console.log('Image is converted!');
                const buffer = fs.readFileSync(targetFilename);
                const base64 = buffer.toString('base64')

                // console.dir (buffer);
                // console.dir(base64);

                fs.unlinkSync(sourceFilename);
                fs.unlinkSync(targetFilename);

                console.log('Convert success!');
                return {
                    statusCode: 200,
                    body: {
                        message: 'Success',
                        data: base64
                    }
                };

            } catch (e) {
                console.error(e);
                return {
                    statusCode: 200,
                    body: {
                        message: 'Error on convert webp.'
                    }
                }
            };
        } else {
            return {
                statusCode: 400,
                body: {
                    message: 'Missing required field!'
                }
            };
        }
    } else {
        return {
            statusCode: 400,
            body: {
                message: 'Request body not found!'
            }
        };
    }
};

exports.handler = handler;