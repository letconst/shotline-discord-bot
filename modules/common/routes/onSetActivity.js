const eventType = {
    start: 'start',
    stop : 'stop',
    debug: 'debug',
};

const activityOptions = {
    type: 'PLAYING',
    name: ''
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('discord.js').Client} client
 */
module.exports = (req, res, client) => {
    if (!req.body.type) return;
    console.log('Received: ' + req.body.type);

    switch (req.body.type) {
        case eventType.start: {
            activityOptions.name = 'ゲームサーバー';
            client.user.setActivity(activityOptions);

            break;
        }

        case eventType.stop: {
            client.user.setActivity();

            break;
        }

        case eventType.debug: {
            activityOptions.name = 'デバッグサーバー';
            client.user.setActivity(activityOptions);

            break;
        }
    }

    res.end();
};