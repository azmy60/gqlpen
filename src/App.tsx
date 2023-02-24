import type { Component } from 'solid-js';
import { For, onCleanup, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, globalStore, save, setGlobalStore } from './state';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import Documentation from './Documentation';
import {
    buildSchema,
    globalQuery,
    schema,
    updateIntrospection,
} from './graphql';
import { Tab, Tabs } from './Tabs';
import { Icon } from 'solid-heroicons';
import { plus } from 'solid-heroicons/solid';
import { pencilSquare, play, xMark } from 'solid-heroicons/outline';
import { produce } from 'solid-js/store';
import SettingsWindow from './SettingsWindow';

const LoadingIcon: Component = () => {
    return (
        <svg
            aria-hidden="true"
            class="animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
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

    const toggleSettings = () => {
        setGlobalStore('rightWindow', globalStore.rightWindow === 'settings' ? 'none' : 'settings');
    }
    const toggleDocs = () => {
        setGlobalStore('rightWindow', globalStore.rightWindow === 'docs' ? 'none' : 'docs');
    }
        

    return (
        <>
            <main class="flex h-screen">
                <div class="flex grow basis-0 flex-col overflow-hidden">
                    <div class="flex items-center px-[1.375rem] py-[1.125rem]">
                        <button
                                onClick={toggleSettings}
                            class="overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {globalStore.endpoint}
                        </button>
                        <div class="ml-2 flex grow items-center">
                            <button
                                onClick={toggleSettings}
                            >
                                <Icon class="h-6 w-6" path={pencilSquare} />
                            </button>
                            <button
                                class="ml-5 font-semibold"
                                onClick={toggleDocs}
                            >
                                Docs
                            </button>
                            <div class="pl-5" />
                            <Show
                                when={!globalStore.isQueryLoading}
                                fallback={
                                    <div class="ml-auto h-6 w-6">
                                        <LoadingIcon />
                                    </div>
                                }
                            >
                                <button class="ml-auto" onClick={globalQuery}>
                                    <Icon class="h-6 w-6" path={play} />
                                </button>
                            </Show>
                        </div>
                    </div>
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
                                                    await updateIntrospection();
                                                    buildSchema();
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
