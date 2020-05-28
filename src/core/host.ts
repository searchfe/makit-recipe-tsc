import {FileSystemHost, Project} from 'ts-morph';

const project = new Project({
});
export const host = project.getFileSystem();

interface CustomFileHost {
    readFile?: (filePath: string, encoding?: string) => Promise<string>;
    readFileSync?: (filePath: string, encoding?: string) => string;
    writeFile?: (filePath: string, fileText: string) => Promise<void>;
    writeFileSync?: (filePath: string, fileText: string) => void;
}

export class Host implements FileSystemHost {
    private fs: any;
    private fastGlob: any;
    constructor(options: CustomFileHost) {
        this.fs = require('fs-extra');
        this.fastGlob = require('fast-glob');
        this.readFile = options.readFile || this.readFile;
        this.readFileSync = options.readFileSync || this.readFileSync;
        this.writeFile = options.writeFile || this.writeFile;
        this.writeFileSync = options.writeFileSync || this.writeFileSync;
    }
    isCaseSensitive = host.isCaseSensitive;
    delete = host['delete'];
    deleteSync = host.deleteSync;
    readDirSync = host.readDirSync;
    readFile = host.readFile;
    readFileSync = host.readFileSync;
    writeFile = host.writeFile;
    writeFileSync = host.writeFileSync;
    mkdir = host.mkdir;
    mkdirSync = host.mkdirSync;
    move = host.move;
    moveSync = host.moveSync;
    copy = host.copy;
    copySync = host.copySync;
    fileExists = host.fileExists;
    fileExistsSync = host.fileExistsSync;
    directoryExists = host.directoryExists;
    directoryExistsSync = host.directoryExistsSync;
    realpathSync = host.realpathSync;
    getCurrentDirectory = host.getCurrentDirectory;
    glob = host.glob;
    globSync = host.globSync;
}
