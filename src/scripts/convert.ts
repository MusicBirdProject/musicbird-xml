const fs = require('fs');
import xmlParser from '../parser/parser';

const sourcePath = process.env.SOURCE;
const targetPath = process.env.TARGET || 'data.json';

if (!sourcePath) {
    throw new Error(`No source file name provided`);
}

fs.readFile(sourcePath, function(err, xmlData) {
    const outData = xmlParser(xmlData.toString());
    const parsedData = outData.root.children.reduce(reduceGpx, {});

    fs.writeFileSync(targetPath, JSON.stringify(parsedData, null, ' '));
    console.log('done');
});

///

function reduceGpx(out, node) {

    switch (node.name) {
        case 'score':
            out = node.children.reduce(reduceScore, out);
            break;

        default:
            console.log('untreated node:', node.name);
    }

    return out;
}

function reduceScore(out, node) {
    switch (node.name) {
        case 'title':
            out.title = node.value;
            break;

        case 'subtitle':
            out.subtitle = node.value;
            break;

        case 'artist':
            out.artist = node.value;
            break;
    }

    return out;
}