import type { Component } from 'solid-js';
import { onCleanup, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, globalStore, save, setGlobalStore } from './state';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar from './TopBar';
import Documentation from './Documentation';
import { buildSchema, globalQuery, schema, getIntrospection } from './graphql';
import { Tab, Tabs } from './Tabs';
import { Icon } from 'solid-heroicons';
import { xMark } from 'solid-heroicons/outline';
import { produce } from 'solid-js/store';
import SettingsWindow from './SettingsWindow';

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
        document.getElementById('splash')?.remove();
        (async () => {
            try {
                const introspection =
                    globalStore.introspection ?? (await getIntrospection());
                buildSchema(introspection);
            } catch (e) {}
        })();

        document.addEventListener('keydown', handleDocumentCtrlS);
        window.addEventListener('beforeunload', confirmExit);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', handleDocumentCtrlS);
        window.removeEventListener('beforeunload', confirmExit);
    });

    function handleNewTab() {
        setGlobalStore(
            'sheets',
            produce((sheets) =>
                sheets.push({
                    name: `Sheet ${sheets.length + 1}`,
                    content: '',
                })
            )
        );
        setGlobalStore('activeSheet', globalStore.sheets.length - 1);
    }

    return (
        <>
            <main class="flex h-screen">
                <div class="flex grow basis-0 flex-col overflow-hidden">
                    <TopBar />
                    <CodeEditor
                        onCtrlEnter={globalQuery}
                        class="grow overflow-auto"
                    />
                </div>
                <div class="bg-neutral pr-3" />
                <div class="grow basis-0 overflow-auto">
                    <Preview />
                </div>
                <Show when={globalStore.rightWindow !== 'none'}>
                    <>
                        <div class="bg-neutral pr-3" />
                        <div class="grow basis-0 overflow-auto px-[1.375rem] pt-[1.125rem]">
                            <div class="flex justify-between pb-8">
                                <h2 class="text-xl font-semibold text-white">
                                    {globalStore.rightWindow === 'settings' &&
                                        'Settings'}
                                    {globalStore.rightWindow === 'docs' &&
                                        'Documentations'}
                                </h2>
                                <button
                                    onClick={() =>
                                        setGlobalStore('rightWindow', 'none')
                                    }
                                >
                                    <Icon class="h-6 w-6" path={xMark} />
                                </button>
                            </div>
                            <Show when={globalStore.rightWindow === 'docs'}>
                                <Show
                                    when={schema()}
                                    fallback={
                                        <div class="flex flex-col items-start gap-4">
                                            <p>
                                                Hmm, it's kinda empty here, have
                                                you load the schema yet?
                                            </p>
                                            <button
                                                disabled={
                                                    globalStore.isIntrospectionLoading
                                                }
                                                onClick={async () => {
                                                    buildSchema(
                                                        await getIntrospection()
                                                    );
                                                }}
                                                class="btn-primary btn-sm btn"
                                            >
                                                Load schema
                                            </button>
                                        </div>
                                    }
                                >
                                    <Documentation schema={schema()!} />
                                </Show>
                            </Show>
                            <Show when={globalStore.rightWindow === 'settings'}>
                                <SettingsWindow />
                            </Show>
                        </div>
                    </>
                </Show>
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
