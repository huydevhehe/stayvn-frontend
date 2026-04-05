const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://pannellum.org/images/kitchen.jpg';
const dest = path.join(__dirname, 'public', 'hotel-360.jpg');

const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Download complete: ' + dest);
  });
}).on('error', function(err) {
  fs.unlink(dest);
  console.error('Error: ' + err.message);
});
