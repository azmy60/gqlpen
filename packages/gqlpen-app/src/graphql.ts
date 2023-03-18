import {
    getIntrospectionQuery,
    GraphQLSchema,
    IntrospectionQuery,
} from 'graphql';
import {
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLObjectType,
} from 'graphql';
import { globalStore, setGlobalStore } from './state';
import { buildClientSchema } from 'graphql';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';

export function extractFields(
    obj: GraphQLObjectType
): GraphQLField<any, any, any>[];
export function extractFields(obj: GraphQLInputObjectType): GraphQLInputField[];
export function extractFields(obj: GraphQLObjectType | GraphQLInputObjectType) {
    const fieldMap = obj.getFields();
    if (!fieldMap) return [];
    return Object.keys(fieldMap).map((key) => fieldMap[key]);
}

const [schema, setSchema] = createSignal<GraphQLSchema | null>(null);

export { schema };

export function buildSchema(introspection: IntrospectionQuery) {
    setSchema(buildClientSchema(introspection));
}

type Headers = Record<string, string>;

function buildHeaders(headers?: Headers) {
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
    };
}

function transformHeadersArrayToObject(
    headers: { key: string; value: string }[]
): Headers {
    return headers.reduce(
        (acc, curr) => ({
            ...acc,
            ...(curr.key && { [curr.key]: curr.value }),
        }),
        {}
    );
}

export async function getIntrospection(): Promise<IntrospectionQuery> {
    setGlobalStore('isIntrospectionLoading', true);
    const introspection = await queryIntrospection(
        globalStore.endpoint,
        transformHeadersArrayToObject(globalStore.introspectionHeaders)
    );
    setGlobalStore('introspection', introspection);
    setGlobalStore('isIntrospectionLoading', false);
    return introspection;
}

async function queryIntrospection(endpoint: string, headers?: Headers) {
    return (await query(endpoint, getIntrospectionQuery(), headers)).data;
}

export async function globalQuery() {
    setGlobalStore('isQueryLoading', true);
    try {
        const result = await query(
            globalStore.endpoint,
            globalStore.sheets[globalStore.activeSheet].content,
            transformHeadersArrayToObject(globalStore.queryHeaders)
        );
        setGlobalStore('result', () => {});
        setGlobalStore('result', result);
    } catch (e) {
        toast.error('Failed to fetch query');
        console.error(e);
    }
    setGlobalStore('isQueryLoading', false);
}

export async function query(
    endpoint: string,
    query: string,
    headers?: Headers
): Promise<any> {
    return fetch(endpoint, {
        method: 'POST',
        headers: buildHeaders(headers),
        body: JSON.stringify({ query }),
    }).then((res) => res.json());
}
