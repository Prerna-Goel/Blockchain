const hexToBinary = require('hex-to-binary');
const{ GENESIS_DATA, MINE_RATE} = require('../config');
const cryptoHash = require('../util/crypto-hash');


class Block{
     constructor({timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
     }

     static genesis(){
        return new this(GENESIS_DATA);  //can use 'block' instead of 'this' .use 'this' because in same class
     }

     static mineBlock({ lastBlock, data})
     {
  //    const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do{
           nonce++;
           timestamp = Date.now();
           difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp});
           hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        }while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, data, difficulty, nonce, hash
      //     hash: cryptoHash(timestamp, lastHash, data, nonce, difficulty)
        });
     }

     static adjustDifficulty({ originalBlock, timestamp }){
        const { difficulty } = originalBlock;

        if (difficulty < 1) return 1;

        //const difference = timestamp - originalBlock.timestamp;

        if((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
     }
}

//having arguments in curly braces, we need not to remember the order in which we have to paas arguments

// const block1 = new Block({
//     data: 'foo-data',
//     timestamp: '01/01/01', 
//     lastHash: 'foo-lastHash',
//     hash: 'foo-hash'
    
// });

// console.log('block1',block1);

module.exports = Block;            //to enable sharing code syntax between files