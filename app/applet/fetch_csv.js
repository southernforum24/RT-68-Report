import fs from 'fs';

async function findGid() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/18xcxFG0sezTQm7Eg5_4WU-ts1wXo-6mXOPNxALrc66g/htmlview');
  const text = await res.text();
  
  // Extract all sheet names and gids
  const regex = /\{name:"([^"]+)",gid:"([^"]+)"/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    console.log(`Sheet: ${match[1]}, GID: ${match[2]}`);
  }
}

findGid();
