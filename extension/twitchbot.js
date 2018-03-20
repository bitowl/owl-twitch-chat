'use strict';

const TwitchBot = require('twitch-bot');


module.exports = function (nodecg) {
    const chatMessages = nodecg.Replicant('chat-messages', {
        defaultValue: []
    });
    const Bot = new TwitchBot({
        username: nodecg.bundleConfig.bot_username,
        oauth: nodecg.bundleConfig.bot_oauth,
        channels: [nodecg.bundleConfig.channel]
    });

   
    
    Bot.on('join', () => {
        nodecg.log.info('Joined channel #' + nodecg.bundleConfig.channel);
        Bot.on('message', chatter => {
            if(chatter.message === '!test') {
                Bot.say('Test successful :3');
                return;
            }
            if (chatter.message === '!trello') {
                Bot.say('Trello board for the stream overlay: https://trello.com/b/XrA7gWtC');
                return;
            }

            chatMessages.value.unshift(chatter); // Store the messages
            nodecg.sendMessage('message', chatter); // Informing the dashboard of new messages

            while (chatMessages.value.length > nodecg.bundleConfig.messagesCount) {
                chatMessages.value.pop();
            }

            console.log(chatMessages.value);
            nodecg.log.info('Received message' , chatter);
            
        });
    });
    
    Bot.on('error', err => {
        nodecg.log.error(err);
    });
}