import { GraphQLSchema } from "graphql";
import { createStore } from "solid-js/store";

const [appStore, setAppStore] = createStore<{
    endpoint: string;
    query: string;
    schema: GraphQLSchema | null;
    result: any;
    introspectionHeaders: { key: string; value: string }[];
    queryHeaders: { key: string; value: string }[];
}>({
    endpoint: 'https://graphql.anilist.co/',
    query: '',
    schema: null,
    result: null,
    introspectionHeaders: [{ key: '', value: '' }],
    queryHeaders: [{ key: '', value: '' }],
});

export { appStore, setAppStore };
