'use strict';

const TwitchBot = require('twitch-bot');

module.exports = function (nodecg) {
    const Bot = new TwitchBot({
        username: nodecg.bundleConfig.bot_username,
        oauth: nodecg.bundleConfig.bot_oauth,
        channels: [nodecg.bundleConfig.channel]
    });
    
    Bot.on('join', () => {
        nodecg.log.info('Joined channel #' + nodecg.bundleConfig.channel);
        Bot.on('message', chatter => {
            nodecg.sendMessage('chat-message', chatter);
            nodecg.log.info('Received message' , chatter);
            if(chatter.message === '!test') {
                Bot.say('Test successful :3');
            }
            if (chatter.message === '!trello') {
                Bot.say('Trello board for the stream overlay: https://trello.com/b/XrA7gWtC');
            }
        });
    });
    
    Bot.on('error', err => {
        nodecg.log.error(err);
    });
}