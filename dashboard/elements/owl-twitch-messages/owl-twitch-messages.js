(function () {
    'use strict';

    class OwlTwitchMessages extends Polymer.Element {
        static get is() {
            return 'owl-twitch-messages';
        }

        ready() {
            super.ready();
            console.log("wtf");
            var messagesDiv = this.$.messages;
            nodecg.listenFor('chat-message', message => {
                messagesDiv.innerHTML = "<div class='message'><div class='name'>" 
                + message.username + "</div><div class='text'>" 
                + message.message + "</div></div>" + messagesDiv.innerHTML;

                            
                console.log(message);
            });
        }
    }
    customElements.define(OwlTwitchMessages.is, OwlTwitchMessages);
})();