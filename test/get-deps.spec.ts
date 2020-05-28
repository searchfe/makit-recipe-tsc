import {Compiler} from '../src/core/compiler';

class CustomCompiler extends Compiler {
    getDenpencies(content: string, filePath: string) {
        return super.getDenpencies(content, filePath);
    }
}

describe('Compiler Option Test', () => {
    it('tsc1 option', () => {
        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src1`
        });
        compiler.loadCompilerOptions();
        compiler.addPlugin({}, 'import');
        let deps = compiler.getDenpencies('const a = 1;', __dirname);
        expect(deps).toEqual([]);
        compiler.addPlugin({
            getDepencies: ({content, filePath, baseDir}) => {
                return ['1', '2', '3']
            }
        }, 'import2');
        deps = compiler.getDenpencies('const a = 1;', __dirname);
        expect(deps).toEqual(['1', '2', '3']);
        compiler.addPlugin({
            getDepencies: ({content, filePath, baseDir}) => {
                return ['4','5']
            }
        });
        compiler.addPlugin({
            getDepencies: ({content, filePath, baseDir}) => {
                expect(content).toEqual('const a = 1;');
                expect(filePath).toEqual(__dirname);
                expect(baseDir).toEqual(`${__dirname}/src1`);
                return ['1','2']
            }
        }, 'import2');
        deps = compiler.getDenpencies('const a = 1;', __dirname);
        expect(deps).toEqual(['1', '2', '4', '5']);
    });
});
