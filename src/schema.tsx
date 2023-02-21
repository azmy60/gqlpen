import { globalStore } from './state';
import type { GraphQLSchema } from 'graphql';
import { buildClientSchema } from 'graphql';
import { createSignal } from 'solid-js';

const [schema, setSchema] = createSignal<GraphQLSchema | null>(null);

export { schema };

export function buildSchema() {
    if (!globalStore.introspection) throw new Error('No introspection data');

    setSchema(buildClientSchema(globalStore.introspection));
}
