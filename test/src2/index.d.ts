/**
 * @file: import.d.ts
 * @description 对一些 import 的类型支持
 */
declare module '*!text' {
    const value: string;
    export default value;
}

declare module '*!tpl' {
    const value: string;
    export default value;
}
declare module '*!san' {
    const value: string;
    export default value;
}

declare module '*!script' {
    const asset: typeof AssetGenerator;
    export default asset;
}

declare module '*!img' {
    const asset: typeof AssetGenerator;
    export default asset;
}

declare module '*!style' {
    const asset: typeof AssetGenerator;
    export default asset;
}

declare abstract class AssetGenerator {
    static type: string;
    static code: string;
    static key: string;
    static version: string;
    static path: string;
    static param: () => {
        type: string;
        code: string;
        key: string;
        version: string;
        path: string;
    };
}
