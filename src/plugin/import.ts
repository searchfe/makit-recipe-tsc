import {Plugin, PluginContext} from '../types';

const importFromReg = /import\s+((?:.|\n)+?)\s+from\s+('|")(.+?)(!(\w+))?\2;/ig;
const importReg = /import((?:.|\n)+?)('|")(.+?)(!(\w+))?\2/ig;

export class Import implements Plugin {
    getDepencies({filePath, content, baseDir}: PluginContext) {
        return [];
    }
}
