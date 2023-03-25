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
import { Component, For, Match, Switch } from 'solid-js';
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

    // TODO maybe we dont need schema and just use introspection?
    return (
        <Context.Provider
            value={{
                schema: () => props.schema,
                goTo: (type) =>
                    setHistory(produce((history) => history.push(type))),
                goBack: () => setHistory(produce((history) => history.pop())),
            }}
        >
            <Show when={history.length > 0} fallback={<MainPage />}>
                <Switch>
                    <Match when={isType(history.at(-1))}>
                        <TypeResolverPage
                            type={history[history.length - 1] as GQLType}
                        />
                    </Match>
                    <Match when={!isType(history.at(-1))}>
                        <FieldPage
                            field={history.at(-1) as GraphQLField<any, any>}
                        />
                    </Match>
                </Switch>
            </Show>
        </Context.Provider>
    );
};

const TypeResolverPage: Component<{
    type: GQLType;
    field?: boolean;
}> = (props) => {
    return (
        <Switch>
            <Match when={isScalarType(props.type)}>
                <ScalarTypePage type={props.type as GraphQLScalarType} />
            </Match>
            <Match when={isObjectType(props.type)}>
                <ObjectTypePage type={props.type as GraphQLObjectType} />
            </Match>
            <Match when={isInputObjectType(props.type)}>
                <InputObjectTypePage
                    type={props.type as GraphQLInputObjectType}
                />
            </Match>
            <Match when={isListType(props.type) || isNonNullType(props.type)}>
                <TypeResolverPage type={(props.type as GQLList).ofType} />
            </Match>
        </Switch>
    );
};

const MainPage: Component = () => {
    const { schema, goTo } = useContext(Context);

    const mutation = schema()?.getMutationType();
    const query = schema()?.getQueryType();

    return (
        <div>
            <Show when={query}>
                <button
                    onClick={() => goTo(query!)}
                    class="link-primary link block"
                    type="button"
                >
                    Query
                </button>
            </Show>
            <Show when={mutation}>
                <button
                    onClick={() => goTo(mutation!)}
                    class="link-primary link block"
                    type="button"
                >
                    Mutation
                </button>
            </Show>
        </div>
    );
};

const ObjectTypePage: Component<{ type: GraphQLObjectType }> = (props) => {
    const { goTo, goBack } = useContext(Context);
    const getFields = () => extractFields(props.type);
    return (
        <div>
            <div class="flex gap-2">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1>{props.type.name}</h1>
            </div>
            <p>{props.type.description}</p>
            <ul class="flex flex-col gap-2">
                <For each={getFields()}>
                    {(field) => (
                        <li>
                            <p>
                                <button onClick={() => goTo(field)}>
                                    {buildFieldNameArgs(field)}
                                </button>{' '}
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

const InputObjectTypePage: Component<{ type: GraphQLInputObjectType }> = (
    props
) => {
    const { goTo, goBack } = useContext(Context);
    const getFields = () => extractFields(props.type);
    return (
        <div>
            <div class="flex gap-2">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1>{props.type.name}</h1>
            </div>
            <p>{props.type.description}</p>
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

const ScalarTypePage: Component<{ type: GraphQLScalarType }> = (props) => {
    const { goBack } = useContext(Context);
    return (
        <div>
            <div class="flex gap-2">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1>{props.type.name}</h1>
            </div>
            <p>{props.type.description}</p>
        </div>
    );
};

const FieldPage: Component<{ field: GQLField }> = (props) => {
    const { goTo, goBack } = useContext(Context);
    return (
        <div>
            <div class="flex gap-2">
                <button onClick={goBack} type="button">
                    <Icon path={arrowLeft} class="h-4 w-4" />
                </button>
                <h1>{props.field.name}</h1>
            </div>
            <p>{props.field.description}</p>
            <button onClick={() => goTo(props.field.type)}>
                {props.field.type.toString()}
            </button>
            <ul class="flex flex-col gap-2">
                <For each={props.field.args}>
                    {(arg) => (
                        <li>
                            <p>
                                <button>{arg.name}</button>{' '}
                                <button onClick={() => goTo(arg.type)}>
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

function buildFieldNameArgs(field: GQLField): string {
    return (
        field.name +
        (field.args.length > 0
            ? '(' + field.args.map((arg) => arg.name).join(', ') + ')'
            : '')
    );
}

export default Documentation;
