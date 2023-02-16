import { Icon } from 'solid-heroicons';
import { cog_6Tooth } from 'solid-heroicons/solid';
import { Component, onCleanup, onMount, ParentComponent } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { getIsStoreDirty, save } from './state';
import HeaderSettingsModal from './HeaderSettingsModal';
import { CodeEditor, Preview } from './CodeEditor';
import TopBar, { sendQuery } from './TopBar';

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
