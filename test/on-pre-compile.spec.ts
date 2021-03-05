import {Compiler} from '../src/core/compiler';
import {removeSync} from 'fs-extra';

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

describe('OnPreCompile Test', () => {
    beforeEach(() => {
        removeSync(`${__dirname}/src1/dist1/`);
    });
    it('tsc2 option', async () => {
        const pathCtx: any = {
            dependencyFullPath: () => `${__dirname}/src1/path.ts`,
            onPreCompile:  ({content, filePath, baseDir}) => {
                if (filePath === `${__dirname}/src1/path.ts`) {
                    return content.replace('zhoujielun', 'wangxinlin');
                }
                return content;
            }
        }
        const mainCtx: any = {
            dependencyFullPath: () => `${__dirname}/src1/main.ts`
        }

        console.time('new Compiler');
        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src1`,
            outDir: `${__dirname}/src1/dist1`
        });
        compiler.addPlugin(pathCtx);
        console.timeEnd('new Compiler');
        console.time('compile path.ts');
        await compiler.compile(pathCtx);
        console.log('outDir', compiler.compilerOptions.outDir);
        console.timeEnd('compile path.ts');

        const {ClassPath} = require(`${__dirname}/src1/dist1/path.js`);
        const cp = new ClassPath();
        expect(cp.name).toEqual('wangxinlin');

    });
});
