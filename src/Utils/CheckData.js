const CheckData = {
    isAuth : (req) => {
        const tokenSession = req.session.token;
        const tokenCookie = req.cookies.token ? req.cookies.token : req.get('Authorization');
        if (!tokenSession && !tokenCookie)
            return false;
        return tokenSession === tokenCookie;
    },
    replaceSymbol : (text) => {
        const regexp = /[&<>"'/=]/g;
        const map = {
            '&': '',
            '<': '',
            '>': '',
            '"': '',
            "'": '',
            "=": '',
            "/": ''
        };
        let charFind = text.search(regexp);
        while(charFind !== -1){
            text = text.replace(regexp, (m) => map[m]);
            charFind = text.search(regexp);
        }
        return text;
    },
    checkInputToReplaceSymbol : (inputObject) => {
        if(!inputObject)
            return null;

        for (const property in inputObject) {
            if(inputObject.hasOwnProperty(property))
                inputObject[property] = CheckData.replaceSymbol(inputObject[property])
        }
        return inputObject;
    }
};

module.exports = CheckData;