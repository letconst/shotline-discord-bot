const Discord = require('discord.js');

const interactionHandler = require('./modules/discord/interactionHandler');

const client = new Discord.Client({ intents: 0 });

require('dotenv').config();

client.login(process.env.DISCORD_TOKEN)
      .catch((err) => {
          console.error(err);
          process.exit(-1);
      });

client.on('interaction', (interaction) => {
    interactionHandler.onInteraction(interaction)
                      .catch((err) => console.error(err));
});