
'use strict';

const Alexa = require('alexa-sdk');
const items = require('./items');
const itemsStats = require('./stats');
const rank = require('./rank');

const APP_ID = 'amzn1.ask.skill.aa45f81a-e10c-4f56-9fae-d134d3fb86d4';

const languageStrings = {
    'en': {
        translation: {
            ITEMS: items.ITEM_EN_US,
            ITEMS_STATS: itemsStats.ITEM_EN_US,
            ITEM_RANK: rank.ITEM_EN_US,
            SKILL_NAME: 'PUBG Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask questions like what are the stats of an Scar-L or where can I find an AKM.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Item for %s.',
            DISPLAY_CARD_TITLE_TWO: '%s  - Item for %s and %s.',
            HELP_MESSAGE: "You can ask questions such as, how can i get a item, what is the stat of an item or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can ask questions such as, how can i get a item, what is the stat of an item or, you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ITEM_REPEAT_MESSAGE: 'Try saying repeat.',
            ITEM_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            ITEM_NOT_FOUND_WITH_ITEM_NAME: 'the item %s. ',
            ITEM_NOT_FOUND_WITHOUT_ITEM_NAME: 'that item. ',
            ITEM_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            ITEMS: items.ITEM_EN_US,
            SKILL_NAME: 'PUBG Helper',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'StatIntent': function(){
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if(itemSlot && itemSlot.value){
          itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myItems = this.t('ITEMS_STATS');
        const item = myItems[itemName];

        if (item) {
            this.attributes.speechOutput = item;
            this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak(item).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, item);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('ITEM_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ITEM_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ITEM_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ITEM_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }

    },
    'RankIntent': function(){
        const itemSlot = this.event.request.intent.slots.Item;
        const itemSlotTwo = this.event.request.intent.slots.ItemTwo;
        let itemOneName;
        let itemTwoName;
        if(itemSlot && itemSlot.value && itemSlotTwo && itemSlotTwo.value){
          itemOneName = itemSlot.value.toLowerCase();
          itemTwoName = itemSlotTwo.value.toLowerCase();
        }
        //need to create a new displaycard
        const cardTitle = this.t('DISPLAY_CARD_TITLE_TWO', this.t('SKILL_NAME'), itemOneName, itemTwoName);
        const myItems = this.t('ITEMS_RANK');
        var itemOne = myItems[itemOneName];
        var itemTwo = myItems[itemTwoName];

        if (itemOne > itemTwo) {
            this.attributes.speechOutput = itemOneName;
            this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');
            this.response.speak(itemOneName).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, itemOneName);
            this.emit(':responseReady');
        } else if(itemTwo > itemOne) {
            this.attributes.speechOutput = itemTwoName;
            this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak(itemTwoName).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, itemTwoName);
            this.emit(':responseReady');
        }else if(itemOne == itemTwo){
            this.attributes.speechOutput = "They are equal";
            this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak("They are equal").listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, "They are equal");
            this.emit(':responseReady');
        }else if (!itemOne){
          //Need to create new messages
            let speechOutput = this.t('ITEM_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ITEM_NOT_FOUND_REPROMPT');
            if (itemOneName) {
                speechOutput += this.t('ITEM_NOT_FOUND_WITH_ITEM_NAME', itemOneName);
            } else {
                speechOutput += this.t('ITEM_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        } else {
          let speechOutput = this.t('ITEM_NOT_FOUND_MESSAGE');
          const repromptSpeech = this.t('ITEM_NOT_FOUND_REPROMPT');
          if (itemTwoName) {
              speechOutput += this.t('ITEM_NOT_FOUND_WITH_ITEM_NAME', itemTwoName);
          } else {
              speechOutput += this.t('ITEM_NOT_FOUND_WITHOUT_ITEM_NAME');
          }
          speechOutput += repromptSpeech;

          this.attributes.speechOutput = speechOutput;
          this.attributes.repromptSpeech = repromptSpeech;

          this.emit(':ask', speechOutput, repromptSpeech);
        }

    },
    'ItemIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myItems = this.t('ITEMS');
        const item = myItems[itemName];

        if (item) {
            this.attributes.speechOutput = item;
            this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak(item).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, item);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('ITEM_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ITEM_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ITEM_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ITEM_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
