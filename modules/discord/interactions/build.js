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
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = async (interaction) => {
    // ビルドロールがなければ実行しない
    if (!interaction.member.roles.member._roles.includes(env.DISCORD_ID_ROLE_BUILD)) {
        return interaction.reply('あなたにはビルドを実行する権限（ロール）がありません。');
    }

    // TODO: 最終ビルドが未完了の場合、そちらをキャンセルするか伺う

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
            // No Content
            case 204:
                // TODO: ビルドをするか伺う
                errMsg = dedent`最新の \`${env.GITHUB_BRANCH_HEAD}\` ブランチの内容は、すでに \`${env.GITHUB_BRANCH_BASE}\` ブランチにマージされています。
                                この内容で過去におそらくビルドされているため、ビルドは実行されません。（後日選択式として対応予定）`;

                logger.warn('Merge failed: No Content');

                break;

            // Forbidden
            case 403:
                errMsg = '操作を実行できませんでした。';

                logger.warn('Merge failed: Forbidden');

                break;

            // Not Found
            case 404:
                errMsg = `マージ元 (\`${env.GITHUB_BRANCH_HEAD}\`) またはマージ先 (\`${env.GITHUB_BRANCH_BASE}\`) のブランチが存在しません。`;

                logger.warn('Merge failed: Not Found');

                break;

            // Conflict
            case 409:
                errMsg = 'マージがコンフリクトしました。手動でマージを行ってください。';

                logger.warn('Merge failed: Conflict');

                break;

            // Unprocessable Entity
            case 422:
                errMsg = '検証に失敗しました。';

                logger.warn('Merge failed: Unprocessable Entity');

                break;
        }
    }).catch((err) => {
        errMsg = '不明なエラーが発生しました。';
        logger.error('Merge failed: ' + err);
    });

    if (!errMsg) logger.info('Merged successfully');

    return interaction.reply(errMsg ?? 'ビルドを開始します。');
}
