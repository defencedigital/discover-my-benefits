const axios = require('axios');

const credCache = new Map();
const qs = require('qs');

exports.setCredCacheToken = cache => {
  return credCache.set(cache, `${cache.token_type} ${cache.access_token}`);
};

exports.getCredCache = cache => {
  return credCache.get(cache);
};

const SchemaURL = Object.freeze({
  CONTENT: 'CONTENT',
  GENERAL: 'GENERAL',
});

const getToken = async ({ CLIENT_ID, CLIENT_SECRET }) => {
  try {
    const response = await fetch(process.env.TOKEN_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'squidex-api',
      }),
    });
    const json = await response.json();
    const token = `${json.token_type} ${json.access_token}`;
    return token;
  } catch (err) {
    return console.warn(err);
  }
};

const getSquidexData = async (url, type) => {
  const token = credCache.get('token');

  try {
    const result = await fetch(`${type === SchemaURL.CONTENT ? process.env.CONTENT_URI : process.env.GENERAL_URI}${url}/`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    const json = await result.json();
    return json;
  } catch (err) {
    return console.warn(err);
  }
};

const API = axios.create({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
  },
});

module.exports = {
  credCache,
  getSquidexData,
  getToken,
  SchemaURL,
  API,
};
