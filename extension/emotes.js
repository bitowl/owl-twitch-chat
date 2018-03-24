'use strict';

module.exports = function() {

    function convertEmotesToMarkdown(message, emotes) {
        console.log('message', message);
        
        var emoteArray = emotes.split('/');
        var emotesContainer = [];

        emoteArray.forEach(element => {
            var parts = element.split(':');
            if (parts.length < 2) {
                return;
            }
            var emoteId = parts[0];
            var range = parts[1];
            var rangeBeginEnd = range.split('-');
            var rangeBegin = parseInt(rangeBeginEnd[0]);
            var rangeEnd = parseInt(rangeBeginEnd[1]);

            emotesContainer.push({
                id: emoteId,
                begin: rangeBegin,
                end: rangeEnd
            });
        });

        emotesContainer.sort((a, b) => {
            return a.begin - b.begin;
        });

        var previousEmoteEnd = 0;
        for (let i = 0; i < emotesContainer.length; i++) {
            const emote = emotesContainer[i];
            emote.messageBefore = message.substring(previousEmoteEnd, emote.begin);
            previousEmoteEnd = emote.end + 1;
        }
        var endMessage = message.substring(previousEmoteEnd);


        var markdown = '';
        for (let i = 0; i < emotesContainer.length; i++) {
            const emote = emotesContainer[i];
            markdown += emote.messageBefore;
            markdown += '![](https://static-cdn.jtvnw.net/emoticons/v1/' + emote.id + '/1.0)';
        }
        markdown += endMessage;
        console.log(markdown);
        return markdown;
    }

    return convertEmotesToMarkdown;
};