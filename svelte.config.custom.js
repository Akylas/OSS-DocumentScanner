const id = process.env['APP_ID'];
const CARD_APP = id ? id === 'com.akylas.cardwallet' : true;
module.exports = {
    replace: [[/CARD_APP/g, !!CARD_APP]]
};
