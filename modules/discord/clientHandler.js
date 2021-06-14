const commands = {
    build: require('./interactions/build')
}

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 */
const onInteraction = (interaction) => {
    if (!interaction.isCommand()) return null;

    return commands[interaction.commandName](interaction);
}

module.exports = {
    onInteraction: onInteraction
}
