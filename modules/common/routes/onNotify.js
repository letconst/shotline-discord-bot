const eventType = {
    success: 'success',
    failed : 'failed',
    timeout: 'timeout'
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('discord.js').Channel} channel
 */
module.exports = async (req, res, channel) => {
    switch (req.body.type) {
        case eventType.success: {
            const version = req.body.version ? ` ${req.body.version} ` : '';
            channel.send(`DeployGateに${req.body.device}版${version}がアップロードされました。\n${req.body.dist}`);
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
};
