import {Compiler} from '../src/core/compiler';
import {removeSync} from 'fs-extra';

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

describe('Compiler Option Test', () => {
    beforeEach(() => {
        removeSync(`${__dirname}/src1/dist/`);
    });
    it('tsc1 option', async () => {
        let pathCountOnDest = 0;
        const pathCtx: any = {
            dependencyFullPath: () => `${__dirname}/src1/path.ts`,
            make: () => {},
            onDest:({filePath}) => {
                if (filePath === `${__dirname}/src1/dist/path.js`) {
                    pathCountOnDest++;
                }
                return true;
            }
        }
        const mainCtx: any = {
            dependencyFullPath: () => `${__dirname}/src1/main.ts`,
            make: () => {},
            onDest:({filePath}) => {
                return true;
            }
        }

        console.time('new Compiler');
        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src1`,
            outDir: `${__dirname}/src1/dist`
        });
        compiler.addPlugin(pathCtx);
        console.timeEnd('new Compiler');

        console.time('compile path.ts');
        await compiler.compile(pathCtx);
        console.timeEnd('compile path.ts');

        console.time('compile main.ts');
        await compiler.compile(mainCtx);
        console.timeEnd('compile main.ts');

        // 现阶段会执行2次
        expect(pathCountOnDest).toEqual(2);
        const {ClassPath} = require(`${__dirname}/src1/dist/path.js`);
        const cp = new ClassPath();
        expect(cp.name).toEqual('zhoujielun');
        // console.log('pathCount', pathCount);

        // console.log('outDir', compiler.compilerOptions.outDir);
    });
});
