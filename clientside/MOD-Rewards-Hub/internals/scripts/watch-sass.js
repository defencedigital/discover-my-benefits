const { exec } = require('child_process');

const baseUrl = './app/sass';
const cssUrl = './app/css';
const services = require('../../app/config').services;

services.forEach((service) => {
  exec(`./node_modules/.bin/node-sass ${baseUrl}/${service}.scss ${cssUrl}/${service}/main.css --output-style compressed --watch`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stderr: ${stderr}`);
  });
  exec(`./node_modules/.bin/node-sass ${baseUrl}/${service}.scss ${cssUrl}/${service}/main.css --output-style compressed`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stderr: ${stderr}`);
  });
});

