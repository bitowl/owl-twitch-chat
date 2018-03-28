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
            value.message = convertEmotesToMarkdown(value.message, value.emotes);
            storeMessage(convertMessageToQuestion(value));
            
        })
    });

    function convertMessageToQuestion(chatter) {
        var question = {};
        question.id = chatter.id;
        question.platform = 'twitch';
        question.user = chatter.display_name;
        question.avatar = chatter.avatar;
        question.text = chatter.message;
        return question;
    }

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