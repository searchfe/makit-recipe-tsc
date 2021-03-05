import {Compiler} from '../src/core/compiler';
import {Plugin} from '../src/types';
import {removeSync} from 'fs-extra';

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

const pathCtx: any = {
    dependencyFullPath: () => `${__dirname}/src1/path.ts`,
    make: () => {},
}
const mainCtx: any = {
    dependencyFullPath: () => `${__dirname}/src1/main.ts`,
    make: () => {},
}

describe('Compiler Option Test', () => {
    beforeEach(() => {
        removeSync(`${__dirname}/src1/dist/`);
    });
    it('tsc1 option', async () => {
        let pathCountOnDest = 0;

        const compileSumPlugin: Plugin = {
            onDest:({filePath}) => {
                if (filePath === `${__dirname}/src1/dist/path.js`) {
                    pathCountOnDest++;
                }
                return true;
            }
        }

        console.time('new Compiler');
        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src1`,
            outDir: `${__dirname}/src1/dist`
        });
        // 加一个计数插件，观察path.js编译次数
        compiler.addPlugin(compileSumPlugin);
        console.timeEnd('new Compiler');

        console.time('compile path.ts');
        await compiler.compile(pathCtx);
        console.timeEnd('compile path.ts');

        console.time('compile main.ts');
        await compiler.compile(mainCtx);
        console.timeEnd('compile main.ts');

        // 不会读取依赖，只执行1次
        expect(pathCountOnDest).toEqual(1);
        const {ClassPath} = require(`${__dirname}/src1/dist/path.js`);
        const cp = new ClassPath();
        expect(cp.name).toEqual('zhoujielun');
        // console.log('pathCount', pathCount);

        // console.log('outDir', compiler.compilerOptions.outDir);
    });
});
