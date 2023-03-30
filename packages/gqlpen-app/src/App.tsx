import type { Component } from 'solid-js';
import { onCleanup, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, globalStore, save, setGlobalStore } from './state';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar from './TopBar';
import Documentation from './Documentation';
import { buildSchema, queryAndUpdateResult, schema, fetchAndUpdateIntrospection } from './graphql';
import { Tab, Tabs } from './Tabs';
import { Icon } from 'solid-heroicons';
import { xMark, arrowPath } from 'solid-heroicons/outline';
import { produce } from 'solid-js/store';
import SettingsWindow from './SettingsWindow';
import {
    keyBindings,
    listenKeybindings,
    unsubscribeKeybindings,
} from './keyBindings';

export const App: Component = () => {
    function confirmExit(event: BeforeUnloadEvent) {
        if (getIsStoreDirty()) {
            event.preventDefault();
            return (event.returnValue = '');
        }
    }

    function handleSave() {
        save();
        toast.success('Saved');
    }

    function toggleSidebar() {
        setGlobalStore('openSidebar', (s) => !s);
    }

    function openDocs() {
        setGlobalStore('openSidebar', true);
        setGlobalStore('sidebar', 'docs');
    }

    function openSettings() {
        setGlobalStore('openSidebar', true);
        setGlobalStore('sidebar', 'settings');
    }

    onMount(() => {
        document.getElementById('splash')?.remove();
        (async () => {
            try {
                const introspection =
                    globalStore.introspection ?? (await fetchAndUpdateIntrospection());
                buildSchema(introspection);
            } catch (e) {}
        })();

        listenKeybindings();

        keyBindings.on('ctrl+s', handleSave);
        keyBindings.on('ctrl+b', toggleSidebar);
        keyBindings.on('ctrl+shift+e', openDocs);
        keyBindings.on('ctrl+shift+d', openSettings);

        window.addEventListener('beforeunload', confirmExit);
    });

    onCleanup(() => {
        unsubscribeKeybindings();

        // have to unsub these because of hot reload
        keyBindings.off('ctrl+s', handleSave);
        keyBindings.off('ctrl+b', toggleSidebar);
        keyBindings.off('ctrl+shift+e', openDocs);
        keyBindings.off('ctrl+shift+d', openSettings);

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

    async function reloadDocs() {
        buildSchema(await fetchAndUpdateIntrospection());
    }

    return (
        <>
            <main class="flex h-screen">
                <div class="flex grow basis-0 flex-col overflow-hidden">
                    <TopBar />
                    <CodeEditor
                        onCtrlEnter={queryAndUpdateResult}
                        class="grow overflow-auto"
                    />
                </div>
                <div class="bg-neutral pr-3" />
                <div class="grow basis-0 overflow-auto">
                    <Preview />
                </div>
                <Show when={globalStore.openSidebar}>
                    <>
                        <div class="bg-neutral pr-3" />
                        <div class="grow basis-0 overflow-auto px-[1.375rem] pt-[1.125rem]">
                            <div class="flex justify-between pb-8">
                                <h2 class="text-xl font-semibold text-white">
                                    {globalStore.sidebar === 'settings' &&
                                        'Settings'}
                                    {globalStore.sidebar === 'docs' &&
                                        'Documentation'}
                                </h2>
                                <div class="item-center flex gap-4">
                                    {globalStore.sidebar === 'docs' && (
                                        <button
                                            disabled={
                                                globalStore.isIntrospectionLoading
                                            }
                                            onClick={reloadDocs}
                                            classList={{
                                                'animate-spin opacity-50':
                                                    globalStore.isIntrospectionLoading,
                                            }}
                                        >
                                            <Icon
                                                class="h-6 w-6"
                                                path={arrowPath}
                                            />
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            setGlobalStore('openSidebar', false)
                                        }
                                    >
                                        <Icon class="h-6 w-6" path={xMark} />
                                    </button>
                                </div>
                            </div>
                            <Show when={globalStore.sidebar === 'docs'}>
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
                                                onClick={reloadDocs}
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
                            <Show when={globalStore.sidebar === 'settings'}>
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
