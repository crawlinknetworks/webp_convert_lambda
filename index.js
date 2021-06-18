const webp = require('webp-converter');
webp.grant_permission();

exports.handler = async (event) => {
    if (event.body) {
        let body = JSON.parse(event.body)

        if (body.base64) {
            try {
                let result = await webp.str2webpstr(body.base64, "png", "-q " + body.quality || '80');
                return {
                    statusCode: 200,
                    body: {
                        message: 'Success',
                        data: result
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