const bodyParser = require('body-parser'); //helps express application to parse json requests
const express = require('express');        //provides functionality of get and post
const request = require('request');       //provides ability to send http get request
const Blockchain = require('./blockchain');           //will use index.js file in blockchain folder
const PubSub = require('./app/pubsub');           //helps to publish and listen to mchannel specific messages

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = 'http://localhost:' + DEFAULT_PORT;

//console.log(ROOT_NODE_ADDRESS);

//setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

//allows someone to read data from the blockchain
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);           // tells how api will repond to the requests
});

//allow someone to add new block to the chain through http
//allow requester to submit data to api and application
//post request receives request from user in json format
app.post('/api/mine', (req, res) => {
    const { data } = req.body;             //req body contains data from user that is to be added to block

    blockchain.addBlock({data});

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
}); 

//console.log('url:', ROOT_NODE_ADDRESS + '/api/blocks');

const synChains = () => {
    request({ url: ROOT_NODE_ADDRESS + '/api/blocks' }, (error, response, body) => {
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);

            console.log('replace chain on a syn with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

let PEER_PORT;               //helps to assign dynamic port

if (process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

//const PORT = 3000;                //listening requests at port number 3000

const PORT = PEER_PORT || DEFAULT_PORT;                    //will set port to default port if peer port is undefined
app.listen(PORT, () => {
    console.log('listening at localhost:' + PORT);


    if(PORT !== DEFAULT_PORT) {
        synChains();
    }
    
});

