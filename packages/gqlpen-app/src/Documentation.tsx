import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLField,
    GraphQLInputType,
    GraphQLOutputType,
    GraphQLScalarType,
    GraphQLList,
    isInputObjectType,
    GraphQLInputObjectType,
} from 'graphql';
import {
    isType,
    isObjectType,
    isScalarType,
    isListType,
    isNonNullType,
} from 'graphql';
import { Component, createEffect, For, Match, Switch } from 'solid-js';
import { Icon } from 'solid-heroicons';
import { arrowLeft } from 'solid-heroicons/solid';
import { createContext, useContext } from 'solid-js';
import { Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { extractFields } from './graphql';

type GQLType = GraphQLInputType | GraphQLOutputType;
type GQLField = GraphQLField<any, any>;
type GQLList = GraphQLList<any>;

const Context = createContext<{
    schema: () => GraphQLSchema | null;
    goTo: (type: GQLType | GQLField) => void;
    goBack: () => void;
}>({
    schema: () => null,
    goTo: () => {},
    goBack: () => {},
});

const Documentation: Component<{ schema: GraphQLSchema }> = (props) => {
    const [history, setHistory] = createStore<(GQLType | GQLField)[]>([]);

    return (
        <Context.Provider
            value={{
                schema: () => props.schema,
                goTo: (type) =>
                    setHistory(produce((history) => history.push(type))),
                goBack: () => setHistory(produce((history) => history.pop())),
            }}
        >
            <Show when={history.length > 0} fallback={<SchemaDocumentation />}>
                <Switch>
                    <Match when={isType(history.at(-1))}>
                        <TypeResolver
                            type={history[history.length - 1] as GQLType}
                        />
                    </Match>
                    <Match when={!isType(history.at(-1))}>
                        <FieldDocumentation
                            field={history.at(-1) as GraphQLField<any, any>}
                        />
                    </Match>
                </Switch>
            </Show>
        </Context.Provider>
    );
};

const TypeResolver: Component<{
    type: GQLType;
    field?: boolean;
}> = (props) => {
    return (
        <Switch>
            <Match when={isScalarType(props.type)}>
                <ScalarDocumentation type={props.type as GraphQLScalarType} />
            </Match>
            <Match when={isObjectType(props.type)}>
                <ObjectDocumentation type={props.type as GraphQLObjectType} />
            </Match>
            <Match when={isInputObjectType(props.type)}>
                <InputObjectDocumentation
                    type={props.type as GraphQLInputObjectType}
                />
            </Match>
            <Match when={isListType(props.type) || isNonNullType(props.type)}>
                <TypeResolver type={(props.type as GQLList).ofType} />
            </Match>
        </Switch>
    );
};

const SchemaDocumentation: Component = () => {
    const { schema, goTo } = useContext(Context);

    const mutation = schema()?.getMutationType();
    const query = schema()?.getQueryType();
    const subscription = schema()?.getSubscriptionType();

    return (
        <div>
            <Show when={query}>
                <button
                    onClick={() => goTo(query!)}
                    class="text-primary-content block hover:underline"
                    type="button"
                >
                    Query
                </button>
            </Show>
            <Show when={mutation}>
                <button
                    onClick={() => goTo(mutation!)}
                    class="text-primary-content block hover:underline"
                    type="button"
                >
                    Mutation
                </button>
            </Show>
            <Show when={subscription}>
                <button
                    onClick={() => goTo(subscription!)}
                    class="text-primary-content block hover:underline"
                    type="button"
                >
                    Mutation
                </button>
            </Show>
        </div>
    );
};

const ObjectDocumentation: Component<{ type: GraphQLObjectType }> = (props) => {
    const { goTo, goBack } = useContext(Context);
    const getFields = () => extractFields(props.type);
    return (
        <div>
            <div class="flex gap-2 pb-4">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1 class="font-semibold">{props.type.name}</h1>
            </div>
            <Show when={props.type.description}>
                <Description description={props.type.description!} />
            </Show>
            <ul class="flex flex-col gap-2">
                <For each={getFields()}>
                    {(field) => (
                        <li>
                            <p>
                                <button
                                    class="text-primary-content hover:underline"
                                    onClick={() => goTo(field)}
                                >
                                    {buildFieldNameArgs(field)}
                                </button>{' '}
                                <button
                                    class="text-secondary-content hover:underline"
                                    onClick={() => goTo(field.type)}
                                >
                                    {field.type.toString()}
                                </button>
                            </p>
                            <p>{field.description}</p>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

const InputObjectDocumentation: Component<{ type: GraphQLInputObjectType }> = (
    props
) => {
    const { goTo, goBack } = useContext(Context);
    const getFields = () => extractFields(props.type);
    return (
        <div>
            <div class="flex gap-2 pb-4">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1 class="font-semibold">{props.type.name}</h1>
            </div>
            <Show when={props.type.description}>
                <Description description={props.type.description!} />
            </Show>
            <ul class="flex flex-col gap-2">
                <For each={getFields()}>
                    {(field) => (
                        <li>
                            <p>
                                <span>{field.name}</span>{' '}
                                <button onClick={() => goTo(field.type)}>
                                    {field.type.toString()}
                                </button>
                            </p>
                            <p>{field.description}</p>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

const ScalarDocumentation: Component<{ type: GraphQLScalarType }> = (props) => {
    const { goBack } = useContext(Context);
    return (
        <div>
            <div class="flex gap-2 pb-4">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1 class="font-semibold">{props.type.name}</h1>
            </div>
            <Show when={props.type.description}>
                <Description description={props.type.description!} />
            </Show>
        </div>
    );
};

const FieldDocumentation: Component<{ field: GQLField }> = (props) => {
    const { goTo, goBack } = useContext(Context);
    return (
        <div>
            <div class="flex gap-2 pb-4">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1 class="font-semibold">{props.field.name}</h1>
            </div>
            <Show when={props.field.description}>
                <Description description={props.field.description!} />
            </Show>
            <button
                onClick={() => goTo(props.field.type)}
                class="text-primary-content pb-4 hover:underline"
            >
                {props.field.type.toString()}
            </button>
            <ul class="flex flex-col gap-2">
                <For each={props.field.args}>
                    {(arg) => (
                        <li>
                            <p>
                                <span>{arg.name}</span>{' '}
                                <button
                                    onClick={() => goTo(arg.type)}
                                    class="text-secondary-content hover:underline"
                                >
                                    {arg.type.toString()}
                                </button>
                            </p>
                            <p>{arg.description}</p>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

const Description: Component<{ description: string }> = (props) => (
    <>
        {/* TODO parse description with markdown parser */}
        <p>{props.description}</p>
        <div class="divider" />
    </>
);

function buildFieldNameArgs(field: GQLField): string {
    return (
        field.name +
        (field.args.length > 0
            ? '(' + field.args.map((arg) => arg.name).join(', ') + ')'
            : '')
    );
}

export default Documentation;
