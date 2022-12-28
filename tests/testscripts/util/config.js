const cred =  require("./appenv");
const domain = cred.domain;
const apiurl = Buffer.from(cred.data.url, 'base64')
const clientid = Buffer.from(cred.data.clientid, 'base64')
const clientsecret = Buffer.from(cred.data.clientsecret, 'base64')
module.exports = {
    "token_url": apiurl.toString(),
    "service_domain": "https://kymareleaseop-srv-prajin."+domain+"/",
    "xsuaa": {
        "grant_type": "client_credentials",
        "client_id": clientid.toString(),
        "client_secret": clientsecret.toString()
    },
    "mock": {
        "url": "https://kymamock-srv-prajin."+domain+"/"
    }
}