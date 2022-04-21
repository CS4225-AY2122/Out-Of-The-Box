let json = require("./moviebank.json");
let fs = require("fs");
output = {};
Object.entries(json).forEach(([key, value]) => {
    output[value] = key;
})
fs.writeFile('moviebank-reverse.json', JSON.stringify(output), function(err) {
    if (err) throw err;
    console.log('complete');
});