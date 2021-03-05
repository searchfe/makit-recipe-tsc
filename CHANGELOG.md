## [1.1.2](https://github.com/searchfe/makit-recipe-tsc/compare/v1.1.1...v1.1.2) (2021-03-05)


### Performance Improvements

* only emit target file ([9db13de](https://github.com/searchfe/makit-recipe-tsc/commit/9db13deef67a7ec34221f1cbee65af513311f6ee))

## [1.1.1](https://github.com/searchfe/makit-recipe-tsc/compare/v1.1.0...v1.1.1) (2021-02-25)


### Bug Fixes

* 实例化 Project 后添加 tsconfig 中的所有文件会导致编译第一个文件时把整个 src 都编译了，改为仅添加 d.ts 加载必要的全局类型声明 ([ee9c47e](https://github.com/searchfe/makit-recipe-tsc/commit/ee9c47e62ea2eb0ea74e2f290071cc5b8d5cb3ed))

# [1.1.0](https://github.com/searchfe/makit-recipe-tsc/compare/v1.0.1...v1.1.0) (2021-02-24)


### Bug Fixes

* remove outDir before each case ([bbe0f6a](https://github.com/searchfe/makit-recipe-tsc/commit/bbe0f6a7df4f65a042c724e7c86fea733f3eb3e8))


### Features

* disable cache for SourceFile ([e2ca38c](https://github.com/searchfe/makit-recipe-tsc/commit/e2ca38cc96d5dea639fa7584be77a4b768841f7f))

## [1.0.1](https://github.com/searchfe/makit-recipe-tsc/compare/v1.0.0...v1.0.1) (2021-02-08)


### Bug Fixes

* 报错改为文件粒度 ([3654f37](https://github.com/searchfe/makit-recipe-tsc/commit/3654f37770b945c19cebfe74ab60c2ee51c83722))

# 1.0.0 (2021-02-05)


### Bug Fixes

* get diagnostics and throw error ([c103d28](https://github.com/searchfe/makit-recipe-tsc/commit/c103d28881e542928c733cfe210ad6468ebf0807))
* travis ([2d0d095](https://github.com/searchfe/makit-recipe-tsc/commit/2d0d095fa004003c53b9a892f2cbe57cff64a5b1))
