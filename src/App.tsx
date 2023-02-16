import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import type { IntrospectionQuery } from 'graphql';
import { Icon } from 'solid-heroicons';
import { arrowPath, cog_6Tooth } from 'solid-heroicons/solid';
import {
    Component,
    createSignal,
    onCleanup,
    onMount,
    ParentComponent,
} from 'solid-js';
import { unwrap } from 'solid-js/store';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, globalStore, save, setGlobalStore } from './state';
import HeaderSettingsModal from './HeaderSettingsModal';
import { CodeEditor, Preview } from './CodeEditor';

async function introspectionFetcher(
    endpoint: string,
    headers?: Record<string, string>
): Promise<IntrospectionQuery> {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...headers,
        },
        body: JSON.stringify({
            query: getIntrospectionQuery(),
        }),
    })
        .then((res) => res.json())
        .then((data) => data.data);
}

function transformHeadersArrayToObject(
    headers: { key: string; value: string }[]
): Record<string, string> {
    return headers.reduce(
        (acc, curr) => ({
            ...acc,
            ...(curr.key && { [curr.key]: curr.value }),
        }),
        {}
    );
}

async function queryFetcher(
    endpoint: string,
    query: string,
    headers?: Record<string, string>
): Promise<any> {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...headers,
        },
        body: JSON.stringify({ query }),
    }).then((res) => res.json());
}

const [loadingQuery, setLoadingQuery] = createSignal(false);

async function sendQuery() {
    setLoadingQuery(true);
    try {
        const result = await queryFetcher(
            globalStore.endpoint,
            globalStore.query,
            transformHeadersArrayToObject(unwrap(globalStore.queryHeaders))
        );
        setGlobalStore('result', () => {});
        setGlobalStore('result', result);
    } catch (e) {
        toast.error('Failed to fetch query');
        console.error(e);
    }
    setLoadingQuery(false);
}

const TopBar: Component = () => {
    const [loading, setLoading] = createSignal(false);

    onMount(() => {
        if (globalStore.endpoint && !globalStore.schema)
            handleLoadIntrospection();
    });

    async function handleLoadIntrospection() {
        setLoading(true);
        try {
            const introspectionQuery = await introspectionFetcher(
                globalStore.endpoint,
                transformHeadersArrayToObject(
                    unwrap(globalStore.introspectionHeaders)
                )
            );
            setGlobalStore('schema', buildClientSchema(introspectionQuery));
        } catch (e) {
            toast.error('Failed to load schema');
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div class="m-2 flex gap-2">
            <div class="relative grow">
                <input
                    type="text"
                    value={globalStore.endpoint}
                    onInput={(e) =>
                        setGlobalStore(
                            'endpoint',
                            (e.target as HTMLInputElement).value
                        )
                    }
                    class="input-bordered input w-full"
                />
                {loading() ? (
                    <div
                        role="status"
                        class="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <svg
                            aria-hidden="true"
                            class="mr-2 inline h-6 w-6 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleLoadIntrospection}
                        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1"
                    >
                        <Icon path={arrowPath} class="h-6 w-6" />
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={sendQuery}
                disabled={loadingQuery()}
                class="btn-primary btn"
            >
                Send
            </button>
        </div>
    );
};

const StatusBar: Component = () => {
    return (
        <div class="flex h-6 items-stretch bg-neutral px-1">
            <div class="grow"></div>
            <StatusBarButton>
                <label for="my-modal">
                    <Icon path={cog_6Tooth} class="h-4 w-4" />
                </label>
            </StatusBarButton>
            <HeaderSettingsModal />
        </div>
    );
};

const StatusBarButton: ParentComponent = ({ children }) => {
    return (
        <div class="flex cursor-pointer items-center px-1 hover:bg-neutral-800">
            {children}
        </div>
    );
};

export const App: Component = () => {
    function handleDocumentCtrlS(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            save();
            toast.success('Saved!');
        }
    }

    function confirmExit(event: BeforeUnloadEvent) {
        if (getIsStoreDirty()) {
            event.preventDefault();
            return (event.returnValue = '');
        }
    }

    onMount(() => {
        document.addEventListener('keydown', handleDocumentCtrlS);
        window.addEventListener('beforeunload', confirmExit);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', handleDocumentCtrlS);
        window.removeEventListener('beforeunload', confirmExit);
    });

    return (
        <>
            <main class="flex h-screen flex-col">
                <TopBar />
                <div class="flex grow flex-col md:flex-row">
                    <div class="grow basis-0">
                        <CodeEditor onCtrlEnter={sendQuery} />
                    </div>
                    <div class="bg-neutral-900 py-0.5" />
                    <div class="grow basis-0">
                        <Preview />
                    </div>
                </div>
                <StatusBar />
            </main>
            <Toaster
                position="bottom-right"
                containerStyle={{
                    'margin-bottom': '1rem',
                }}
            />
        </>
    );
};
