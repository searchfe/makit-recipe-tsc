import {Compiler} from '../../src/core/compiler';
import {removeSync} from 'fs-extra';
import { resolve } from 'path';

const dir = resolve(__dirname, '../');

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

describe('Compiler Option Test', () => {
    beforeEach(() => {
        removeSync(`${dir}/src1/dist/`);
    });
    it('tsc1 option', async () => {

        const mainCtx: any = {
            dependencyFullPath: () => `${dir}/src1/main.ts`,
            make: () => {},
            onDest:({filePath}) => {
                return true;
            }
        }

        console.time('new Compiler');
        const compiler = new CustomCompiler({
            baseDir: `${dir}/src1`,
            outDir: `${dir}/src1/dist3`
        });
        compiler.addPlugin(mainCtx);

        await compiler.compile(mainCtx);
        console.timeEnd('compile main.ts');

    });
});
