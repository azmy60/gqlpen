import { Component, onCleanup, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, globalStore, save } from './state';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar, { sendQuery } from './TopBar';
import StatusBar from './StatusBar';
import Documentation from './Documentation';
import { buildSchema, schema } from './schema';

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
        buildSchema()
    } catch(e) {
        console.error(e)
        toast.error('Failed to build schema')
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
                    <div class="grow basis-0 overflow-auto">
                        <CodeEditor onCtrlEnter={sendQuery} />
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
