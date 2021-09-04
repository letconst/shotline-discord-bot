const subCommands = {
    start: require('./server.start'),
    stop : require('./server.stop')
};

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = (interaction) => {
    return subCommands[interaction.options._subcommand](interaction);
};
