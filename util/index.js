const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

const ec = new EC('secp256k1');          //standards of efficient cryptocraphy prime 
//256 for 256 bits prime number in ellipics algorithm......1 for first implementation..k for scientist's name

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data),signature);
};

module.exports = { ec, verifySignature, cryptoHash };