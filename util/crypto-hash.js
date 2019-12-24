const crypto = require('crypto');
//const hexToBinary = require('hex-to-binary');

// we did not convert block hash into binary because will require more space. so we leave it in hex form. and convert it to binary only in 
//mineBlock function of block.js where we are upgrading nonce value;  

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');


    hash.update(inputs.sort().join(' '));

    // return hexToBinary(hash.digest('hex'));
    return hash.digest('hex');

};

module.exports = cryptoHash;