import { globalStore } from './state';
import { buildClientSchema, GraphQLSchema } from 'graphql';

export function getSchema(): GraphQLSchema | undefined {
    if (!globalStore.introspection) return;
    return buildClientSchema(globalStore.introspection);
}
