(function () {
    'use strict';

    class OwlTwitchMessages extends Polymer.Element {
        static get is() {
            return 'owl-twitch-messages';
        }

        ready() {
            console.log(nodecg.bundleConfig.messagesCount);
            super.ready();
            this.messages = [
                {
                    'username': 'system',
                    'message': 'no messages yet loaded'
                }
            ];
            nodecg.readReplicant('chat-messages', value => { // Read old messages once
                this.messages = value;
            });
            nodecg.listenFor('message', value => {
                this.unshift('messages', value);
                if (this.messages.length > nodecg.bundleConfig.messagesCount) {
                    this.pop('messages');
                }
            });
        }
        highlightMessage(event) {
            nodecg.sendMessageToBundle('add-question', 'owl-question-box', event.model.item);
        }
        clearMessages() {
            this.set('messages', []);
            nodecg.sendMessage('clear-messages')
        }
    }
    customElements.define(OwlTwitchMessages.is, OwlTwitchMessages);
})();