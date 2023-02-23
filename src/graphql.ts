import type { GraphQLSchema } from 'graphql';
import {
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLObjectType,
} from 'graphql';
import { globalStore } from './state';
import { buildClientSchema } from 'graphql';
import { createSignal } from 'solid-js';

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

export function buildSchema() {
    if (!globalStore.introspection) throw new Error('No introspection data');

    setSchema(buildClientSchema(globalStore.introspection));
}
