import type { Component } from 'solid-js';
import { For, onCleanup, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { globalStore, save, setGlobalStore } from './state';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import Documentation from './Documentation';
import { buildSchema, globalQuery, schema } from './graphql';
import { Tab, Tabs } from './Tabs';
import { Icon } from 'solid-heroicons';
import { plus } from 'solid-heroicons/solid';
import { produce } from 'solid-js/store';

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

    try {
        buildSchema();
    } catch (e) {
        console.error(e);
        toast.error('Failed to build schema');
    }

    onMount(() => {
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
            <main class="flex h-screen flex-col">
                <TopBar />
                <div class="flex grow basis-0 flex-col overflow-x-hidden md:flex-row">
                    <div class="flex grow basis-0 flex-col">
                        <Tabs>
                            <For each={globalStore.sheets}>
                                {(sheet, i) => (
                                    <Tab
                                        active={i() === globalStore.activeSheet}
                                        onClick={() =>
                                            setGlobalStore('activeSheet', i)
                                        }
                                    >
                                        {sheet.name}
                                    </Tab>
                                )}
                            </For>
                            <button onClick={handleNewTab} class="ml-2 h-full">
                                <Icon path={plus} class="h-4 w-4" />
                            </button>
                        </Tabs>
                        <CodeEditor
                            onCtrlEnter={globalQuery}
                            class="grow overflow-auto"
                        />
                    </div>
                    <div class="bg-neutral-900 py-0.5" />
                    <div class="grow basis-0 overflow-auto">
                        <Preview />
                    </div>
                    <Show when={globalStore.openDocs}>
                        <div class="grow basis-0 overflow-auto">
                            <Show when={schema()}>
                                <Documentation schema={schema()!} />
                            </Show>
                        </div>
                    </Show>
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
