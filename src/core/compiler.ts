import {resolve} from 'path';
import {readFileSync, readFile, writeFile, writeFileSync} from 'fs';
import {ParseConfigHost, sys, parseJsonConfigFileContent} from 'typescript';
import {Project, CompilerOptions, FileSystemHost} from 'ts-morph';
import {Context} from 'makit';
import {ForRule, RuleOptions, Plugin} from '../types';
import {cloneDeep} from './clone';
import {Host} from './host';

export class Compiler implements ForRule {
    /** compile folder */
    private baseDir: string;
    /** dist folder */
    private outDir: string;
    /** tsconfigPath */
    private configPath: string;
    public compilerOptions: CompilerOptions;
    private customCompilerOptions: CompilerOptions;
    private plugin: Map<string, Plugin> = new Map();
    /** save content from preprocess plugin */
    // private contentCache: Map<string, string> = new Map();
    /** tsc Project */
    private project: Project;
    /** file host */
    private host: FileSystemHost;
    /** 记录编译过一次的 file 需要 refresh SourceFile */
    private fileNeedToRefreshMap: {
        [filePath: string]: true;
    } = {};

    constructor(options : Options) {
        this.baseDir = options.baseDir;
        this.outDir = options.outDir || undefined;
        // this.outDir = options.outDir || this.baseDir;
        /** default tsconfig.json */
        this.configPath = options.configPath || resolve(this.baseDir, 'tsconfig.json');
    }

    public addPlugin(plugin: Plugin, name: string = this.plugin.size.toString()) {
        this.plugin.set(name, plugin);
    }

    /** export params for making rule */
    public forRule() {
        const ruleOptions: RuleOptions =  [
            `${this.outDir}/**.js`, `${this.baseDir}/**.ts`,
            ctx => {
                this.compile(ctx);
            }];
        return ruleOptions;
    }

    /**  */
    public async compile(ctx: Context) {
        const filePath = ctx.dependencyFullPath();
        // update CompilerOptions onece
        this.loadCompilerOptions();
        let content = readFileSync(filePath).toString();
        // get deps
        let deps = this.getDenpencies(content, filePath);
        // modify deps
        deps = this.processDeps(deps);
        // make deps
        while (deps.length > 0) {
            const dep = deps.shift();
            await ctx.make(dep);
        }

        const project = this.getProject();
        const sourcefile = project.addSourceFileAtPath(filePath);
        if (this.fileNeedToRefreshMap[filePath]) {
            sourcefile.refreshFromFileSystemSync();
        }
        this.fileNeedToRefreshMap[filePath] = true;
        return project.emit({
            targetSourceFile: sourcefile
        });
    }

    protected getDenpencies(content: string, filePath: string) {
        const deps: string[] = [];
        this.plugin.forEach(plugin => {
            if (plugin.getDepencies) {
                deps.push(...plugin.getDepencies({content, filePath, 'baseDir': this.baseDir}));
            }
        });
        return deps;
    }

    /** deps decoration modify */
    protected processDeps(oldDeps: string[]) {
        let deps = oldDeps;
        this.plugin.forEach(plugin => {
            if (plugin.beforeMakeDepencies) {
                deps = plugin.beforeMakeDepencies(deps, this.baseDir, this.outDir);
            }
        });
        return deps;
    }

    protected preCompile(content: string, filePath: string) {
        let rs: string = content;
        this.plugin.forEach(plugin => {
            if (plugin.onPreCompile) {
                rs = plugin.onPreCompile({'content': rs, filePath, 'baseDir': this.baseDir});
            }
        });
        return rs;
    }

    protected afterCompile(content: string, filePath: string) {
        let rs: string = content;
        this.plugin.forEach(plugin => {
            if (plugin.afterCompile) {
                rs = plugin.afterCompile({'content': rs, filePath, 'baseDir': this.baseDir});
            }
        });
        return rs;
    }

    protected onDest(content: string, filePath: string) {
        let mark = true;
        this.plugin.forEach(plugin => {
            if (plugin.onDest && mark) {
                mark = plugin.onDest({'content': content, filePath, 'baseDir': this.baseDir});
            }
        });
        return mark;
    }

    private getProject() {
        if (this.project === undefined) {
            this.getCompilerHost();
            // Object.keys(this.customHost).forEach(key => {
            //     if (this.customHost[key]) {
            //         this.host[key] = this.customHost[key];
            //     }
            // });
            this.project = new Project({
                'compilerOptions': this.compilerOptions,
                'fileSystem': this.host
            });
        }
        return this.project;
    }

    private getCompilerHost() {
        this.host = new Host({
            'readFileSync': (fileName: string) => {
                let content = readFileSync(fileName).toString();
                return this.preCompile(content, fileName);
            },
            'readFile': async (fileName: string) => {
                // const rs = this.contentCache.get(fileName);
                // if (rs === undefined) {
                return new Promise((resolve, reject) => {
                    readFile(fileName, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(
                                this.preCompile(data.toString(), fileName)
                            );
                        }
                    });
                });
                // }
                // return rs;
            },
            'writeFileSync': (filePath: string, fileText: string) => {
                const text = this.afterCompile(fileText, filePath);
                if (this.onDest(fileText, filePath)) {
                    return writeFileSync(filePath, text);
                }
            },
            'writeFile': async (filePath: string, fileText: string) => {
                const text = this.afterCompile(fileText, filePath);
                if (this.onDest(fileText, filePath)) {
                    return new Promise((resolve, reject) => {
                        writeFile(filePath, text, {}, err => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }
            }
        });
    }

    public loadCompilerOptions() {
        if (this.compilerOptions) {
            return;
        }
        const customCompilerOptions = cloneDeep(this.customCompilerOptions || {});
        if (this.configPath) {
            const configContent = readFileSync(this.configPath);
            const json = JSON.parse(configContent.toString()).compilerOptions;
            this.compilerOptions = customCompilerOptions;
            Object.keys(json).forEach(key => {
                if (this.compilerOptions[key] === undefined) {
                    this.compilerOptions[key] = json[key];
                }
            });
            this.compilerOptions = this.formatConfig({'compilerOptions': this.compilerOptions}).options;
        }
        else {
            this.compilerOptions = this.formatConfig({'compilerOptions': customCompilerOptions}).options;
        }
        this.compilerOptions.outDir = this.outDir || this.compilerOptions.outDir || this.baseDir;
        this.outDir = this.compilerOptions.outDir;
    }

    private formatConfig(conf: any = {}) {
        let config = conf || {};
        config.compilerOptions = config.compilerOptions || {};
        const parseConfigHost: ParseConfigHost = {
            'fileExists': sys.fileExists,
            'readFile': sys.readFile,
            'readDirectory': sys.readDirectory,
            'useCaseSensitiveFileNames': true
        };
        config = parseJsonConfigFileContent(
            config,
            parseConfigHost,
            this.baseDir
        );
        config.options.baseUrl = config.options.baseUrl || (this.baseDir + '/');
        return config;
    }
}

export interface Options {
    baseDir: string
    outDir?: string
    configPath?: string
}

