require('../../utils/initializer')();
const { DISCORD_ID_ROLE_BUILD } = process.env;

const subCommands = {
    start : require('./build.start'),
    cancel: require('./build.cancel')
};

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = async (interaction) => {
    // ビルドロールがなければ実行しない
    if (!interaction.member.roles.member._roles.includes(DISCORD_ID_ROLE_BUILD)) {
        return interaction.reply('あなたにはビルドを実行する権限（ロール）がありません。');
    }

    return subCommands[interaction.options._subcommand](interaction);
};
