'use strict';
const qr = require('qrcode');
const axios = require("axios");
const util = require("./util");
const { PassThrough } = require('stream');
const logger = require('cf-nodejs-logging-support');
logger.setLoggingLevel("info");


async function postImage(context, msg, event) {
        try{
            console.log("msg in post image", msg.data);
            const destination = {};
            for (const envName of Object.getOwnPropertyNames(process.env).filter( name => name.startsWith("dest_"))) {
                const name = envName.substr("dest_".length);
                destination[name] = process.env[envName];
            }
            const destinationNameFromContextString = process.env.destination_name;
            const destinationNameFromContext = JSON.parse(destinationNameFromContextString);
            const destinationName = destinationNameFromContext.name;
            const data = await util.readDetails(destination, destinationName, context, logger);
            const response = await processBpPayload(data.authTokens[0].value, data.destinationConfiguration, msg, destinationNameFromContext);
            return response;
                
                //return "Success";
        }catch(error){
            throw error;
        }
}

async function processBpPayload(accessToken, destinationConfiguration, msg, destinationNameFromContext) {
        let bpDetails = msg.data;
        if (bpDetails.verificationStatus === "VERIFIED") {
            bpDetails.searchTerm1 = bpDetails.verificationStatus;
            bpDetails.businessPartnerIsBlocked = false;
        } else {
            bpDetails.searchTerm1 = bpDetails.verificationStatus;
            bpDetails.businessPartnerIsBlocked = true;
        }
        try{
            const headers = await fetchXsrfToken(destinationConfiguration, accessToken, bpDetails, destinationNameFromContext);
            if (bpDetails.addressModified && bpDetails.addressModified != undefined) {
                await updateBpAddress(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext);
                await updateBp(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext);
                if(!bpDetails.businessPartnerIsBlocked){
                   await postGeneratedImage(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext);
                    return "SUCCESS";
                }
                return "SUCCESS"; 
            } else {
                await updateBp(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext);
                if(!bpDetails.businessPartnerIsBlocked && bpDetails.addressId != undefined){
                    await postGeneratedImage(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext);
                    return "SUCCESS";
                }
                return "SUCCESS";
            }
        }catch(error){
            logger.info("error", error);
            return error;
        }
}

/*async function fetchXsrfToken(destinationConfiguration, accessToken, bpDetails, destinationNameFromContext) {
    const attachmentSrvApi = destinationNameFromContext.attachmentSrvApi;
    return await axios({
            method: 'get',
            url: destinationConfiguration.URL + attachmentSrvApi + "/",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'Image/png',
                'Slug': bpDetails.businessPartner + ".png",
                'BusinessObjectTypeName': destinationNameFromContext.businessObjectTypeName,
                'LinkedSAPObjectKey': bpDetails.businessPartner,
                'x-csrf-token': 'fetch'
            }
        }).then(response => {
                const headers = {
                    token: response.headers['x-csrf-token'],
                    cookie: response.headers['set-cookie'][0]
                };
                logger.info("Success - Fetching CSRF Token : ");
                return headers;
        }).catch(error => {
            logger.info("Error - Fetching CSRF token Error", error);
            throw util.errorHandler(error, logger);
        });
}*/

async function fetchXsrfToken(destinationConfiguration, accessToken, bpDetails, destinationNameFromContext) {
    const businessPartnerSrvApi = destinationNameFromContext.businessPartnerSrvApi;
    return await axios({
            method: 'get',
            url: destinationConfiguration.URL  + "/A_BusinessPartnerAddress",
            headers: {
                'Authorization': `Basic ${accessToken}`,
                'x-csrf-token': 'fetch',
                'SAP-Connectivity-SCC-Location_ID': 'KYMA'
            }
        }).then(response => {
                var cookies = '"';
                for (var i = 0; i < response.headers["set-cookie"].length; i++) {
                        cookies += response.headers["set-cookie"][i] + ";";
                }
                cookies += '"';
                const headers = {
                    token: response.headers['x-csrf-token'],
                    cookie: cookies
                };
                logger.info("Success - Fetching CSRF Token : ");
             console.log("success fetching xsrf token");
                return headers;
        }).catch(error => {
            console.log("erro rin fetching xsrf token");
            logger.info("Error - Fetching CSRF token Error");
             
            throw util.errorHandler(error, logger);
        });
}

async function updateBpAddress(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext) {
        const businessPartnerSrvApi = destinationNameFromContext.businessPartnerSrvApi;
        return await axios({
            method: 'patch',
            url: destinationConfiguration.URL +"/A_BusinessPartnerAddress(BusinessPartner='" + bpDetails.businessPartner + "',AddressID='" + bpDetails.addressId + "')",
            headers: {
                'Authorization': `Basic ${accessToken}`,
                'Content-Type': 'application/json',
                'x-csrf-token': headers.token,
                'Cookie': headers.cookie,
                 'SAP-Connectivity-SCC-Location_ID': 'KYMA'  
            },
            data: {
                "PostalCode": bpDetails.postalCode,
                "StreetName": bpDetails.streetName
            }
        }).then(response =>{
             console.log("SUCCESS - Updating BP Address");
            logger.info("SUCCESS - Updating BP Address");
        }).catch(error => {
                 console.log("Failed - Updating BP Address");
            logger.info("Error Updating BP Address", error);
            throw util.errorHandler(error, logger);
        });
}

async function updateBp(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext) {
        console.log("inside updateBP", headers.token);
        console.log("inside updateBP", headers.cookie);
    const businessPartnerSrvApi = destinationNameFromContext.businessPartnerSrvApi;
       return await axios({
            method: 'patch',
            url: destinationConfiguration.URL + "/A_BusinessPartner('" + bpDetails.businessPartner + "')",
            headers: {
                'Authorization': `Basic ${accessToken}`,
                'Content-Type': 'application/json',
                'x-csrf-token': headers.token,
                'Cookie': headers.cookie,
                 'SAP-Connectivity-SCC-Location_ID': 'KYMA'
            },
            data: {
                "SearchTerm1": bpDetails.searchTerm1,
                "BusinessPartnerIsBlocked": bpDetails.businessPartnerIsBlocked
            }
        }).then(response =>{
            logger.info("Success - Updating BP");
        }).catch(error => {
            logger.info("Error in Updating BP");
            throw util.errorHandler(error, logger);
        });
}

async function postGeneratedImage(destinationConfiguration, accessToken, headers, bpDetails, destinationNameFromContext) {
    const attachmentSrvApi = destinationNameFromContext.attachmentSrvApi;
        const location = '';
    const businessObjectTypeName = destinationNameFromContext.businessObjectTypeName;
            return await generateQRCode(bpDetails).then(async image =>{
                const bp = bpDetails.businessPartner;
                return await axios({
                    method: 'post',
                    url: destinationConfiguration.URL + attachmentSrvApi + "/AttachmentContentSet",
                    headers: {
                        'Authorization': `Basic ${accessToken}`,
                        'Content-Type': 'Image/jpg',
                        'Slug': bp + '.jpg',
                        'BusinessObjectTypeName': businessObjectTypeName,
                        'LinkedSAPObjectKey': bp.padStart(10,0),
                        'x-csrf-token': headers.token,
                        'Cookie': headers.cookie,
                        'SAP-Connectivity-SCC-Location_ID': 'KYMA'
                    },
                    data: image,
                }).then(response =>{
                    console.log("success image");
                    logger.info("SUCCESS - Uploading Image");
                }).catch(error => {
                    console.log("uploading image", error);
                    logger.info("ERROR - Uploading Image");
                    throw util.errorHandler(error, logger);
                });
            }).catch(error => {
                logger.info("ERROR - uploading image");
                throw error;
            });
}

function generateQRCode(bpDetails){
    return new Promise(function (resolve, reject) {
        let imageData = {
            businessPartner: bpDetails.businessPartner,
            businessPartnerName: bpDetails.businessPartnerName,
            addressId: bpDetails.addressId,
            streetName: bpDetails.streetName,
            country: bpDetails.country,
            postalCode: bpDetails.postalCode
        }

        const stream = new PassThrough();
        qr.toFileStream(stream, JSON.stringify(imageData));
        let chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        let image;
        stream.on('end',  () =>{
            image = Buffer.concat(chunks);
            resolve(image);
        });

        stream.on("error", error => {
            logger.info("ERROR - QR Code generation");
            reject(new Error("ERROR - Generating QR Code"));
        });
    });
}

module.exports = {
    postImage
};
