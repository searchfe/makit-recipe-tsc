import {Compiler} from '../src/core/compiler';

class CustomCompiler extends Compiler {
    processDeps(deps: string[]) {
        return super.processDeps(deps);
    }
}

describe('Before Make Deps Test', () => {
    it('add deps subfix', () => {
        const compiler = new CustomCompiler({
            baseDir: `${__dirname}/src1`
        });
        compiler.loadCompilerOptions();
        compiler.addPlugin({
            beforeMakeDepencies: (deps) => deps.map(dep => dep + '.deps')
        }, 'deps');
        const deps = compiler.processDeps(['a', 'b']);
        expect(deps).toEqual(['a.deps', 'b.deps'])
    });
});
