const Discord       = require('discord.js');
const app           = require('express')();
const bodyParser    = require('body-parser');
const clientHandler = require('./modules/discord/clientHandler');
const routeHandler  = require('./modules/common/routeHandler');
const logger        = require('./modules/utils/logger');

require('./modules/utils/initializer')();
const { PORT, DISCORD_TOKEN, DISCORD_ID_CHANNEL_BUILDS } = process.env;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const client = new Discord.Client({ intents: 0 });

client.login(DISCORD_TOKEN)
      .then(async () => {
          logger.info('Bot is ready!');

          const channel = await client.channels.fetch(DISCORD_ID_CHANNEL_BUILDS);

          // DeployGate情報を返す
          app.get('/data', routeHandler.onData);

          // Discordへの通知用
          app.post('/notify', (req, res) => routeHandler.onNotify(req, res, channel));

          // アクティビティ設定用
          app.post('/setActivity', (req, res) => routeHandler.onSetActivity(req, res, client));

          app.listen(PORT);
      })
      .catch((err) => {
          logger.error(err);
          process.exit(-1);
      });

client.on('interactionCreate', async (interaction) => {
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
