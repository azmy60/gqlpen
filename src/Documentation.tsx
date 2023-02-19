import type { GraphQLSchema, GraphQLObjectType, GraphQLField } from 'graphql';
import { Component, For } from 'solid-js';
import { Icon } from 'solid-heroicons';
import { arrowLeft } from 'solid-heroicons/solid';
import { createContext, useContext } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { extractFields } from './graphql';

type Page = 'main' | 'query' | 'mutation';

const Context = createContext<{ schema: GraphQLSchema | null }>({
    schema: null,
});

const [activePage, setActivePage] = createSignal<Page>('query');

const Documentation: Component<{ schema: GraphQLSchema }> = ({ schema }) => {
    console.log(schema);
    return (
        <Context.Provider value={{ schema }}>
            <Show when={activePage() === 'main'}>
                <MainPage />
            </Show>
            <Show when={activePage() === 'query'}>
                <ObjectPage object={schema.getQueryType()!} />
            </Show>
            <Show when={activePage() === 'mutation'}>
                <ObjectPage object={schema.getMutationType()!} />
            </Show>
        </Context.Provider>
    );
};

const MainPage: Component = () => {
    const { schema } = useContext(Context);

    return (
        <div>
            <button
                onClick={() => setActivePage('query')}
                class={`link-primary link block ${
                    !schema?.getMutationType() && 'link-accent'
                }`}
                type="button"
                disabled={!schema?.getQueryType()}
            >
                Query
            </button>
            <button
                onClick={() => setActivePage('mutation')}
                class={`link-primary link block ${
                    !schema?.getMutationType() && 'link-accent'
                }`}
                type="button"
                disabled={!schema?.getMutationType()}
            >
                Mutation
            </button>
        </div>
    );
};

function buildFieldNameArgs(field: GraphQLField<any, any, any>): string {
    return (
        field.name +
        (field.args.length > 0
            ? '(' + field.args.map((arg) => arg.name).join(', ') + ')'
            : '')
    );
}

const ObjectPage: Component<{ object: GraphQLObjectType }> = ({ object }) => {
    const fields = extractFields(object);
    return (
        <div>
            <div class="flex gap-2">
                <button onClick={() => setActivePage('main')} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1>{object.name}</h1>
                <p>{object.description}</p>
            </div>
            <ul class="flex flex-col gap-2">
                <For each={fields}>
                    {(field) => (
                        <li>
                            <p>
                                <button>{buildFieldNameArgs(field)}</button> 
                                {' '}
                                <button>{field.type.toString()}</button>
                            </p>
                            <p>{field.description}</p>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

export default Documentation;
