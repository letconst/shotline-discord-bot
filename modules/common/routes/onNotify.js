const eventType = {
    success: 'success',
    failed : 'failed',
    timeout: 'timeout'
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('discord.js').Channel} channel
 */
module.exports = async (req, res, channel) => {
    switch (req.body.type) {
        case eventType.success: {
            channel.send(`DeployGateにiOS版 ${req.body.version} がアップロードされました。`);
            break;
        }

        case eventType.failed: {
            channel.send(`DeployGateにアップロードできませんでした。\n${req.body.message}`);
            break;
        }

        case eventType.timeout: {
            channel.send('自宅サーバーに接続できなかったため、DeployGateへのアップロードは行われませんでした。');
            break;
        }
    }

    res.end();
}