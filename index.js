const Discord       = require('discord.js');
const clientHandler = require('./modules/discord/clientHandler');
const logger        = require('./modules/utils/logger');

require('./modules/utils/initializer')();

const client = new Discord.Client({ intents: 0 });

client.login(process.env.DISCORD_TOKEN)
      .then(() => logger.info('Bot is ready!'))
      .catch((err) => {
          logger.error(err);
          process.exit(-1);
      });

client.on('interaction', async (interaction) => {
    await clientHandler.onInteraction(interaction)
                       .catch((err) => logger.error(err));
});

process
    .on('exit', () => client.destroy())
    .on('SIGTERM', () => client.destroy())
    .on('SIGINT', () => {
        client.destroy();
        process.exit(0);
    });
