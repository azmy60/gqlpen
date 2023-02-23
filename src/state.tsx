import { GraphQLSchema, IntrospectionQuery } from 'graphql';
import { createStore } from 'solid-js/store';

interface PersistentGlobalStore {
    endpoint: string;
    query: string;
    schema: GraphQLSchema | null;
    introspection: IntrospectionQuery | null;
    result: any;
    introspectionHeaders: { key: string; value: string }[];
    queryHeaders: { key: string; value: string }[];
    openDocs: boolean;
    sheets: { name: string; content: string }[];
    activeSheet: number;
}

interface TemporaryGlobalStore {
    isQueryLoading: boolean;
}

type GlobalStore = PersistentGlobalStore & TemporaryGlobalStore;

function loadGlobalStore(): PersistentGlobalStore {
    try {
        return JSON.parse(localStorage.__gqlpen_globalStore);
    } catch (e) {
        return {
            endpoint: 'https://graphql-pokemon2.vercel.app',
            query: '',
            schema: null,
            introspection: null,
            result: {},
            introspectionHeaders: [{ key: '', value: '' }],
            queryHeaders: [{ key: '', value: '' }],
            openDocs: false,
            sheets: [{ name: 'Sheet 1', content: '' }],
            activeSheet: 0,
        };
    }
}

function saveGlobalStore(data: PersistentGlobalStore) {
    localStorage.setItem('__gqlpen_globalStore', JSON.stringify(data));
}

let isStoreDirty = false;

export function save() {
    const { isQueryLoading, ...rest } = globalStore;
    saveGlobalStore(rest);
    isStoreDirty = false;
}

const [globalStore, _setGlobalStore] = createStore<GlobalStore>({
    ...loadGlobalStore(),
    isQueryLoading: false,
});

export { globalStore };

export function getIsStoreDirty() {
    return isStoreDirty;
}

// @ts-ignore
export const setGlobalStore: typeof _setGlobalStore = (...args) => {
    // @ts-ignore
    _setGlobalStore(...args);
    isStoreDirty = true;
};
