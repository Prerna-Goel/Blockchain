/*const redis = require('redis');

const CHANNELS ={
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.publisher = redis.createClient(); //publish messages to all interested parties in network
        this.subscriber = redis.createClient(); // listening to specific channel for new message

        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log('Message received. Channel: ' + channel + '. Message: ' + message + '.');
    }
}

const testPubSub = new PubSub();
testPubSub.publisher.publish(CHANNELS.TEST, 'foo');*/

const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-0b550568-df4f-4801-978d-ffd395795ab9',
    subscribeKey: 'sub-c-c02252d6-2416-11ea-894a-b6462cb07a90',
    secretKey: 'sec-c-NzVmY2FiNTItMTViYi00YzQwLWFhNTUtYzQ0YWRhYzkyMDlk'
};

const CHANNELS ={
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub{
    constructor({ blockchain}) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
      }


    listener() {
        return {
                message: messageObject => {
                    const { channel, message } = messageObject;

                    console.log('Message received. Channel: ' +  channel + '. Message: ' + message + '.');
                    const parsedMessage = JSON.parse(message);

                    if (channel === CHANNELS.BLOCKCHAIN){
                        this.blockchain.replaceChain(parsedMessage);
                    }
                }
        };
    }

    //we are going to avoid redundant interactions..listerner do not want to listen message that he published himself...
    //solution....unsubscribe from channel before publishing, and subscribe again after publishing to listen to further messages
    publish({ channel, message }){
      //  this.pubnub.unsubscribe({ channel });

        this.pubnub.publish({ channel, message });

     //   this.pubnub.subscribe({channel});
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)    //because we can publish only string messages over channel
        });
    }
}

//const testPubSub = new PubSub();
//testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;


//run using node pubsub.js