'use strict';
//Links required frameworks and javascript modules
const Alexa = require('alexa-sdk');
const items = require('./items');
const itemsStats = require('./stats');
const rank = require('./rank');

const APP_ID = 'amzn1.ask.skill.aa45f81a-e10c-4f56-9fae-d134d3fb86d4';
//Most of the generalized speech output, %s is a version of concatenation
const languageStrings = {
    'en': {
        translation: {
            ITEMS: items.ITEM_EN_US,
            ITEMS_STATS: itemsStats.ITEM_EN_US,
            ITEM_RANK: rank.ITEM_EN_US,
            SKILL_NAME: 'PlayerUnknown Battleground Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask questions like what are the stats of an Scar L or where can I find an A K M.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Response for %s.',
            DISPLAY_CARD_TITLE_TWO: '%s  - Response for %s and %s.',
            WEAPON_CHOICE: 'The %s is the better choice based off of collected statistics from the PlayerUnknown Battleground Wiki',
            HELP_MESSAGE: "You can ask questions such as, how can i get a item, what is the stat of an item or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can ask questions such as, how can i get a item, what is the stat of an item or, you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Thanks for using PlayerUnknown Battleground Helper, let me know if you need more help!!',
            ITEM_REPEAT_MESSAGE: 'Try saying repeat.',
            ITEM_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            NEITHER_ITEM_FOUND: 'I\'m sorry, neither %s or %s are currently in our database.',
            ITEM_NOT_FOUND_WITH_ITEM_NAME: 'the item %s. ',
            ITEM_NOT_FOUND_WITHOUT_ITEM_NAME: 'that item. ',
            ITEM_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            ITEMS: items.ITEM_EN_US,
            SKILL_NAME: 'PlayerUnknown Battleground Helper',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        //was an ask
        this.emit('SessionEndedRequest');
    },
    'StatIntent': function () {
        //itemSlot is the variable that stores the users spoken item
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        //If the user said an item and the item exist in the module sheet then it is stored in itemName
        if(itemSlot && itemSlot.value){
          itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myItems = this.t('ITEMS_STATS');
        //takes the users request finds the items stats that correspond 
        const item = myItems[itemName];

        if (item) {
            this.attributes.speechOutput = item;
            //this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak(item);
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
        
        this.emit(':tell', this.t('STOP_MESSAGE'));

    },
    'RankIntent': function(){
        const itemSlot = this.event.request.intent.slots.Item;
        const itemSlotTwo = this.event.request.intent.slots.ItemTwo;
        let itemOneName;
        let itemTwoName;
        if(itemSlot && itemSlot.value){
          itemOneName = itemSlot.value.toLowerCase();
        }
        if (itemSlotTwo && itemSlotTwo.value) {
            itemTwoName = itemSlotTwo.value.toLowerCase();
        }
        //need to create a new displaycard
        const cardTitle = this.t('DISPLAY_CARD_TITLE_TWO', this.t('SKILL_NAME'), itemOneName, itemTwoName);
        const myItems = this.t('ITEM_RANK');
        var itemOne = myItems[itemOneName];
        var itemTwo = myItems[itemTwoName];

        if (itemOne < itemTwo) {
            this.attributes.speechOutput = this.t('WEAPON_CHOICE' , itemOneName);
            //this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');
            this.response.speak(this.t('WEAPON_CHOICE', itemOneName));
            this.response.cardRenderer(cardTitle, this.t('WEAPON_CHOICE', itemOneName));
            this.emit(':responseReady');
            this.emit(':tell', this.t('STOP_MESSAGE'));
            this.emit('SessionEndedRequest');
        } else if(itemTwo < itemOne) {
            this.attributes.speechOutput = this.t('WEAPON_CHOICE', itemTwoName);
            //this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');
            this.response.speak(this.t('WEAPON_CHOICE', itemTwoName));
            this.response.cardRenderer(cardTitle, this.t('WEAPON_CHOICE', itemTwoName));
            this.emit(':responseReady');
            this.emit(':tell', this.t('STOP_MESSAGE'));
            this.emit('SessionEndedRequest');
        } else if (itemOne == undefined && itemTwo == undefined) {
            this.attributes.speechOutput = this.t('NEITHER_ITEM_FOUND', itemOneName, itemTwoName);
            //this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');
            this.response.speak(this.t('NEITHER_ITEM_FOUND', itemOneName, itemTwoName));
            this.response.cardRenderer(cardTitle, this.t('NEITHER_ITEM_FOUND', itemOneName, itemTwoName));
            this.emit(':responseReady');

        } else if (itemOne == itemTwo) {
            this.attributes.speechOutput = "They are equal weapons, take your pick based on personal preference";
           // this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');
            this.response.speak("They are equal weapons, take your pick based on personal preference");
            this.response.cardRenderer(cardTitle, "They are equal weapons, take your pick based on personal preference");
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
            //this.attributes.repromptSpeech = this.t('ITEM_REPEAT_MESSAGE');

            this.response.speak(item);
            this.response.cardRenderer(cardTitle, item);
            this.emit(':responseReady');
            this.emit('SessionEndedRequest');

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
        //was an ask
        this.emit('SessionEndedRequest');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};