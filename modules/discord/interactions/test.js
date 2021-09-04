/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 */
module.exports = async (interaction) => {
    console.log(interaction.options.getSubCommand());

    await interaction.reply('OK');
};