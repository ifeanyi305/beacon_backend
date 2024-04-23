const { usdtIcon, pplIcon, ppdIcon } = require("./coinIcons")

const setCoinIcon =  (crypto) => {
    if (crypto == "USDT"){
        return usdtIcon;
    }

    if (crypto == "PPD"){
        return ppdIcon;
    }

    if (crypto == "PPL"){
        return pplIcon;
    }
}

module.exports = {setCoinIcon};