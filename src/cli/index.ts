import cli from './cli';
import './commands/parse';

///

cli.version('0.0.1').parse(process.argv);
