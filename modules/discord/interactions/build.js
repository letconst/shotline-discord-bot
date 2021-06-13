/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = async (interaction) => {
    return interaction.reply({ content: 'test' });
}
