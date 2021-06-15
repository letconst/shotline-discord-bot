const logger = require('../utils/logger');

const commands = {
    build: require('./interactions/build')
}

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 */
const onInteraction = (interaction) => {
    if (!interaction.isCommand()) return null;

    logger.info('Received command: ' + interaction.commandName);

    return commands[interaction.commandName](interaction);
}

module.exports = {
    onInteraction: onInteraction
}
