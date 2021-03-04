import {Compiler} from '../src/core/compiler';
import {removeSync} from 'fs-extra';

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

describe('Compiler Option Test', () => {
    beforeEach(() => {
        removeSync(`${__dirname}/src2/dist/`);
    });
    it('tsc1 option', async () => {
        let text = 'unmake';
        const pathCtx: any = {
            dependencyFullPath: () => `${__dirname}/src2/path.ts`,
            make: async (str) => {
                if (str === './dist/page.san.html') {
                    text = 'maked'
                } else {
                    throw new Error('un caught makefile');
                }
            },
            getDepencies: ({content, filePath, baseDir}) => {
                return ['./dist/page.san.html'];
            },
            onPreCompile:  ({content, filePath, baseDir}) => {
                if (filePath === `${__dirname}/src2/main.ts`) {
                    return content.replace(`import templateHTML from './page.san.html!tpl';`, `const templateHTML = "${text}";`);
                }
                return content;
            },
            onDest:({filePath}) => {
                if (filePath === `${__dirname}/src2/dist/path.js`) {
                    // pathCountOnDest++;
                }
                return true;
            }
        }
        const mainCtx: any = {
            dependencyFullPath: () => `${__dirname}/src2/main.ts`,
            make: async (str) => {
                console.log('enter make', str);
                if (str === './dist/page.san.html') {
                    text = 'maked'
                } else {
                    throw new Error('un caught makefile');
                }
            },
            onDest:({filePath}) => {
                return true;
            }
        }

        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src2`,
            outDir: `${__dirname}/src2/dist`
        });
        compiler.addPlugin(pathCtx);

        await compiler.compile(pathCtx);

        await compiler.compile(mainCtx);

        const {templateHTML} = require(`${__dirname}/src2/dist/main.js`);
        expect(templateHTML).toEqual('maked');

    });

    it('tsc throw error', async() => {
        const mainCtx: any = {
            dependencyFullPath: () => `${__dirname}/src3/main.ts`,
            make: async (str) => {
            },
            onDest:({filePath}) => {
                return true;
            }
        }

        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src3`,
            outDir: `${__dirname}/src3/dist`
        });

        try {
            await compiler.compile(mainCtx)
        } catch (error) {
            // 会报错：error TS2339: Property 'notDefined' does not exist on type 'Window'
            expect(error.toString()).toContain('TS2339:');
        }
    })
});
