const fetch  = require('node-fetch');
const logger = require('../../utils/logger');

require('../../utils/initializer')();
const { UCB_TOKEN, UCB_URL } = process.env;

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 */
module.exports = async (interaction) => {
    let canCancel = false;
    let msg       = '';

    const fetchHeaders = {
        'Content-Type': 'application/json',
        Authorization : `Basic ${UCB_TOKEN}`
    };

    const getBuildsData = {
        method : 'GET',
        headers: fetchHeaders
    };

    // 最新ビルドがキャンセル可能か確認
    await fetch(`${UCB_URL}/builds?per_page=1`, getBuildsData)
        .then((res) => res.json())
        .then((data) => {
            const buildStatus = data[0].buildStatus;

            if (buildStatus === 'started' || buildStatus === 'restarted') {
                canCancel = true;
            }
        });

    if (!canCancel) {
        msg = '実行中のビルドがありません。';
        logger.info('No cancellable build found');

        return interaction.reply(msg);
    }

    const cancelBuildData = {
        method : 'DELETE',
        headers: fetchHeaders
    };

    // ビルドキャンセルをリクエスト
    await fetch(`${UCB_URL}/builds`, cancelBuildData)
        .then((_) => {
            msg = '実行中のビルドをキャンセルしました。';
            logger.info('The latest build has been cancelled');
        });

    return interaction.reply(msg);
};
