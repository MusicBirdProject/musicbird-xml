const fs = require('fs');
import xmlParser from '../parser/parser';

const sourcePath = process.env.SOURCE;
const targetPath = process.env.TARGET || 'data.json';

if (!sourcePath) {
    throw new Error(`No source file name provided`);
}

fs.readFile(sourcePath, function(err, xmlData) {
    const outData = xmlParser(xmlData.toString());

    fs.writeFileSync(targetPath, JSON.stringify(outData, null, ' '));
    console.log('done');
});
