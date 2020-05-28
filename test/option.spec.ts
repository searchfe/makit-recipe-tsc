import {Compiler} from '../src/core/compiler';
describe('Compiler Option Test', () => {
    it('tsc1 option', () => {
        const compiler = new Compiler({
            baseDir: `${__dirname}/src1`
        });
        compiler.loadCompilerOptions();
        const options = compiler.compilerOptions;
        expect(options.outDir).toEqual(`${__dirname}/src1/dist`);
        expect(options.baseUrl).toEqual(`${__dirname}/src1/`);
    });
});
