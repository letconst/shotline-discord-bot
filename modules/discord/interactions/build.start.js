const { Octokit } = require('@octokit/rest');
const dedent      = require('dedent');
const logger      = require('../../utils/logger');

require('../../utils/initializer')();
const env = process.env;

const octokit = new Octokit({
    auth: env.GITHUB_TOKEN
});

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 */
module.exports = async (interaction) => {
    let errMsg;

    // mainブランチをクラウドビルドブランチにマージ
    await octokit.repos.merge({
        owner: env.GITHUB_OWNER,
        repo : env.GITHUB_TARGET_REPO,
        base : env.GITHUB_BRANCH_BASE,
        head : env.GITHUB_BRANCH_HEAD
    }).then((res) => {
        logger.info('Status code: ' + res.status);

        switch (res.status) {
            // Forbidden
            case 403: {
                errMsg = '操作を実行できませんでした。';

                logger.warn('Merge failed: Forbidden');

                break;
            }

            // Not Found
            case 404: {
                errMsg = `マージ元 (\`${env.GITHUB_BRANCH_HEAD}\`) またはマージ先 (\`${env.GITHUB_BRANCH_BASE}\`) のブランチが存在しません。`;

                logger.warn('Merge failed: Not Found');

                break;
            }

            // Conflict
            case 409: {
                errMsg = 'マージがコンフリクトしました。手動でマージを行ってください。';

                logger.warn('Merge failed: Conflict');

                break;
            }

            // Unprocessable Entity
            case 422: {
                errMsg = '検証に失敗しました。';

                logger.warn('Merge failed: Unprocessable Entity');

                break;
            }
        }
    }).catch((err) => {
        errMsg = '不明なエラーが発生しました。';
        logger.error('Merge failed: ' + err);
    });

    if (!errMsg) logger.info('Merged successfully');

    return interaction.reply(errMsg ?? 'ビルドを開始します。');
};
