const chakram = require('chakram');

async function authLogin(email, password) {
    return chakram.post(process.env.BASE_URL + 'v1/auth/login', {
        email: email,
        password: password
    });
}

function unixTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
}



module.exports = {authLogin: authLogin, unixTimestamp: unixTimestamp};