import https from 'https';

https.get('https://docs.google.com/spreadsheets/d/18xcxFG0sezTQm7Eg5_4WU-ts1wXo-6mXOPNxALrc66g/htmlview', (res) => {
  console.log("CORS headers:", res.headers['access-control-allow-origin']);
});
