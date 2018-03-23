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

    const twitchApi = nodecg.extensions['lfg-twitchapi']; // TODO: maybe move this to another bundle?

    
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

            fetchUserAvatar(chatter.username, (avatar) => {
                chatter.avatar = avatar;
                storeMessage(chatter);
            })
            
        });
    });
    

    function storeMessage(chatter) {

        chatMessages.value.unshift(chatter); // Store the messages
        nodecg.sendMessage('message', chatter); // Informing the dashboard of new messages

        while (chatMessages.value.length > nodecg.bundleConfig.messagesCount) {
            chatMessages.value.pop();
        }

        console.log(chatMessages.value);
        nodecg.log.info('Received message' , chatter);
    }

    var avatarCache = {};

    function fetchUserAvatar(username, callback) {
        if (avatarCache.hasOwnProperty(username)) {
            nodecg.log.info('Fetched avatar for ' + username + ' from cache');
            callback(avatarCache[username]);
            return;
        }

        twitchApi.get('/users/' + username, {
        }).then(response => {
            if (response.statusCode !== 200) {
                nodecg.log.error(response.body.error, response.body.message);
                return;
            }

            nodecg.log.info('Fetched avatar for ' + username + ' from Twitch');
            var avatar = response.body.logo;
            avatarCache[username] = avatar;
            callback(avatar);

        }).catch(err => {
            nodecg.log.error(err);
        });
    }

    /*chatMessages.on('change', (newVal) => {
        console.log('Replicant changed');
        newVal.forEach(element => {
            fetchUserAvatar(element.username, function(avatar) {
                element.avatar = avatar;
            });
        });
    });*/



    Bot.on('error', err => {
        nodecg.log.error(err);
    });

    nodecg.listenFor('clear-messages', () => {
        chatMessages.value = [];
    });
}