const forever    = require('forever-monitor');
const fetch      = require('node-fetch');
const fs         = require('fs');

const { SHOTLINE_SERVER_DIR, PORT } = process.env;

/**
 * .envファイルの内容をオブジェクト化する
 * @param {string} target - ファイルの内容
 * @return {{string: string}}
 */
const parseEnv = (target) => {
    const result  = {};
    const entries = target.split('\r\n');

    for (let entry of entries) {
        if (entry === '') continue;

        const [key, value] = entry.split('=');
        result[key]        = value;
    }

    return result;
};

/**
 *
 * @param {import('discord.js').CommandInteraction} interaction
 * @return {import('discord.js').CommandInteraction.reply}
 */
module.exports = (interaction) => {
    if (global.gameServerProcess?.running) {
        return interaction.reply('サーバーはすでに起動しています。');
    }

    // サーバーの環境変数にこちらのものが使われてしまうため、直接読んで渡す
    const envContent = fs.readFileSync(`${SHOTLINE_SERVER_DIR}/.env`, { encoding: 'utf-8' });
    const env        = parseEnv(envContent);

    const child = new (forever.Monitor)('index.js', {
        silent  : true,
        max     : 1,
        killTree: true,
        env     : env,
        cwd     : SHOTLINE_SERVER_DIR
    });

    child.start();
    global.gameServerProcess = child;

    // foreverのstopではサーバー側の終了イベントが取れないため、こちらで自己ポスト
    child.on('exit', () => {
        fetch(`http://localhost:${PORT}/setActivity`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body   : JSON.stringify({ type: 'stop' })
        });
    });

    return interaction.reply('サーバーを起動しました。');
};
