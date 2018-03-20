'use strict';

const TwitchBot = require('twitch-bot');

module.exports = function (nodecg) {
    const Bot = new TwitchBot({
        username: nodecg.bundleConfig['bot-username'],
        oauth: nodecg.bundleConfig['bot-oauth'],
        channels: [nodecg.bundleConfig['bot-channel']]
    });
    
    Bot.on('join', () => {
        nodecg.log.info('Joined channel');
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