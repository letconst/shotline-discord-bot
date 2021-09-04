/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = (interaction) => {
    if (!global.gameServerProcess?.running) {
        global.gameServerProcess = null;

        return interaction.reply('サーバーは起動していません。');
    }

    global.gameServerProcess.stop();
    global.gameServerProcess = null;

    return interaction.reply('サーバーを停止しました。');
};
