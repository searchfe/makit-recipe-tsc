
export function cloneDeep(foo) {
    if (Array.isArray(foo)) {
        return [...foo];
    }
    if (typeof foo === 'object' && foo !== null) {
        let ret = {};
        for (const key in foo) {
            ret[key] = cloneDeep(foo[key]);
        }
        return ret;
    }
    return foo;
}

