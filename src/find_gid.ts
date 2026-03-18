async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/18xcxFG0sezTQm7Eg5_4WU-ts1wXo-6mXOPNxALrc66g/export?format=csv&gid=644248229');
  const text = await res.text();
  console.log(text);
}

fetchCSV();
