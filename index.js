const Discord       = require('discord.js');
const clientHandler = require('./modules/discord/clientHandler');

require('./modules/utils/initializer')();

const client = new Discord.Client({ intents: 0 });

client.login(process.env.DISCORD_TOKEN)
      .catch((err) => {
          console.error(err);
          process.exit(-1);
      });

client.on('interaction', async (interaction) => {
    await clientHandler.onInteraction(interaction)
                       .catch((err) => console.error(err));
});

process
    .on('exit', () => client.destroy())
    .on('SIGTERM', () => client.destroy())
    .on('SIGINT', () => {
        client.destroy();
        process.exit(0);
    });
