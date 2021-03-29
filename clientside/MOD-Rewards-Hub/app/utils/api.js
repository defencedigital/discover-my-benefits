import axios from 'axios';

// Tried to externalise with process.env but doesn't seem to work as expected
// Using axios as it's installed and gives a nicer interface to fetch
export const API = axios.create({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
  },
});
