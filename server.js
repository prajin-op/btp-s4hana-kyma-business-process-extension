const cds = require ('@sap/cds');
const express = require('express');

cds.on('bootstrap', (app) => {
    console.log("process.env", process.env);
});

// Delegate bootstrapping to built-in server.js
module.exports = cds.server;