'use strict';


const userAvatar = require('./useravatar');

module.exports = function (nodecg) {
    const twitchBot = nodecg.extensions['owl-twitch-bot'];
    const fetchUserAvatar = userAvatar(nodecg);
    const convertEmotesToMarkdown = require('./emotes')();

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
    }

    nodecg.listenFor('clear-messages', () => {
        chatMessages.value = [];
    });
}