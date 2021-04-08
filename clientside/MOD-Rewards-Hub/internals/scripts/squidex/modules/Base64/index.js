const https = require('https');
const fs = require('fs');
const path = require('path');
const cmsDirectory = path.join(__dirname, `../../../../../app/images/cms`);
const cmsServiceDirectory = path.join(__dirname, `../../../../../app/images/cms/${process.env.SERVICE}`);

class Base64 {
  async convert(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        return resolve(url);
      }

      https.get(url, (resp) => {
        console.log(`Base64 converting ${url}`);

        let imagedata = '';
        resp.setEncoding('binary');

        resp.on('data', (chunk) => {
          imagedata += chunk;
        });

        resp.on('end', () => {
          const cmsDirectoryExists = fs.existsSync(cmsDirectory);

          if (!cmsDirectoryExists) {
            console.log(`creating CMS directory @ ${cmsDirectory}`);
            fs.mkdirSync(cmsDirectory);
          }

          const cmsServiceDirectoryExists = fs.existsSync(cmsServiceDirectory);

          if (!cmsServiceDirectoryExists) {
            console.log(`creating CMS directory @ ${cmsServiceDirectory}`);
            fs.mkdirSync(cmsServiceDirectory);
          }

          if (fs.existsSync(cmsServiceDirectory)) {
            const urlParts = url.split('/');
            const id = urlParts[urlParts.length - 1];

            fs.writeFile(`${cmsServiceDirectory}/${id}.jpg`, imagedata, 'binary', (err) => {
              if (err) {
                throw err;
              }
              console.log(` -> ${cmsServiceDirectory}/${id}.jpg`);
              resolve(`/${process.env.SERVICE}/${id}.jpg`);

              return true;
            });
          } else {
            throw new Error('Error making directory for CMS images');
          }
        });
      }).on('error', (e) => {
        console.log(`Base64 Convert had error: ${e.message}`);
        reject(e);
      });

      return true;
    });

    
  }
}

module.exports = Base64;
