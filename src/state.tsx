import { GraphQLSchema } from 'graphql';
import { createStore } from 'solid-js/store';

interface GlobalStore {
    endpoint: string;
    query: string;
    schema: GraphQLSchema | null;
    result: any;
    introspectionHeaders: { key: string; value: string }[];
    queryHeaders: { key: string; value: string }[];
}

function getSavedGlobalStore(): GlobalStore {
    try {
        return JSON.parse(localStorage.__gqlpen_globalStore);
    } catch (e) {
        return {
            endpoint: 'https://graphql-pokemon2.vercel.app',
            query: '',
            schema: null,
            result: {},
            introspectionHeaders: [{ key: '', value: '' }],
            queryHeaders: [{ key: '', value: '' }],
        };
    }
}

const [globalStore, _setGlobalStore] = createStore<GlobalStore>(
    getSavedGlobalStore()
);

export { globalStore };

let isStoreDirty = false;

export function getIsStoreDirty() {
    return isStoreDirty;
}

// @ts-ignore
export const setGlobalStore: typeof _setGlobalStore = (...args) => {
    // @ts-ignore
    _setGlobalStore(...args);
    isStoreDirty = true;
};

export function save() {
    localStorage.setItem('__gqlpen_globalStore', JSON.stringify(globalStore));
    isStoreDirty = false;
}