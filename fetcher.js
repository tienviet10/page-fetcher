const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let args = process.argv.slice(2);

if (args.length !== 2) process.exit();


const printTemplate = (len, dir) => {
  console.log(`Downloaded and saved ${len} bytes to ${dir}`);
};

const writeToFile = (body) => {
  fs.writeFile(args[1], body, err => {
    if (err) {
      console.log("Something went wrong. Please check file path!");
      process.exit(0);
    } else {
      printTemplate(body.length, args[1]);
    }
  });
};

request(args[0], (error, response, body) => {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  if (error) {
    console.log('error:', error);
    process.exit(0);
  }

  if (response.statusCode === 404) {
    console.log("URL does not exist");
    process.exit(0);
  }

  if (response.statusCode === 200) {
    if (fs.existsSync(args[1])) {
      rl.question('The file already exists. Would you like to override the file? (y/N) ', (answer) => {
        if (answer === "y") {
          writeToFile(body);
        }
        rl.close();
      });
    } else {
      writeToFile(body);
    }
  }
});




