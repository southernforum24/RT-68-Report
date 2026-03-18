import fs from 'fs';

async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/18xcxFG0sezTQm7Eg5_4WU-ts1wXo-6mXOPNxALrc66g/export?format=csv');
  const text = await res.text();
  console.log(text.split('\n').slice(-20).join('\n'));
}

fetchCSV();
