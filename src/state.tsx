import { GraphQLSchema, IntrospectionQuery } from 'graphql';
import { createStore } from 'solid-js/store';

interface GlobalStore {
    endpoint: string;
    query: string;
    schema: GraphQLSchema | null;
    introspection: IntrospectionQuery | null;
    result: any;
    introspectionHeaders: { key: string; value: string }[];
    queryHeaders: { key: string; value: string }[];
    openDocs: boolean;
    isQueryLoading: boolean;
}

type SavedGlobalStore = Omit<GlobalStore, 'isQueryLoading'>;

function loadGlobalStore(): SavedGlobalStore {
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
        };
    }
}

function saveGlobalStore(data: SavedGlobalStore) {
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
