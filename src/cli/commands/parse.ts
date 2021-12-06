import * as fs from 'fs';
import cli from '../cli';
import { parseXml } from '../../main';

export default cli.command('parse', 'Parse XML into JSON tree').alias('p')
    .argument('<source-file>', 'Source XML file')
    .argument('<target-file>', 'Target JSON file')
    .action(function (args, options, logger) {
        const source = fs.readFileSync(args.sourceFile);
        const parsed = parseXml(source.toString());

        fs.writeFileSync(args.targetFile, JSON.stringify(parsed));
        logger.log(`${args.sourceFile} was parsed into a ${args.targetFile}`);
    });
