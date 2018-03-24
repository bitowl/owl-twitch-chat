'use strict';

module.exports = function (nodecg) {
    const twitchBot = nodecg.extensions['owl-twitch-bot'];
    const twitchApi = nodecg.extensions['lfg-twitchapi'];

    const chatMessages = nodecg.Replicant('chat-messages', {
        defaultValue: []
    });

    twitchBot.on('message', value => {
        fetchUserAvatar(value.username, avatar => {
            value.avatar = avatar;
            storeMessage(value);
        })
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

    nodecg.listenFor('clear-messages', () => {
        chatMessages.value = [];
    });
}