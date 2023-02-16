import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
} from '@codemirror/autocomplete';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { graphql, updateSchema } from 'cm6-graphql';
import {
    createCodeMirror,
    createEditorControlledValue,
    createEditorReadonly,
} from 'solid-codemirror';
import { Component, createEffect } from 'solid-js';
import { globalStore, setGlobalStore } from './state';
import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
} from '@codemirror/commands';
import { json } from '@codemirror/lang-json';

const fullHeight = EditorView.theme({ '&': { height: '100%' } });

export const CodeEditor: Component<{
    onCtrlEnter: () => void;
}> = ({ onCtrlEnter }) => {
    const { ref, createExtension, editorView } = createCodeMirror({
        onValueChange: (value) => setGlobalStore('query', value),
    });

    createEditorControlledValue(editorView, () => globalStore.query);
    createExtension([
        fullHeight,
        graphql(),
        autocompletion(),
        oneDark,
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        history(),
        lineNumbers(),
        keymap.of([
            {
                key: 'Ctrl-Enter',
                run() {
                    onCtrlEnter();
                    return true;
                },
            },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...completionKeymap,
            indentWithTab,
        ]),
    ]);

    createEffect(() => {
        if (globalStore.schema && editorView()) {
            updateSchema(editorView(), globalStore.schema);
        }
    });

    return <div ref={ref} class="h-full" />;
};

export const Preview: Component = () => {
    const { ref, createExtension, editorView } = createCodeMirror();

    createEditorReadonly(editorView, () => true);
    createEditorControlledValue(editorView, () =>
        JSON.stringify(globalStore.result, null, 2)
    );
    createExtension([
        fullHeight,
        EditorView.theme({
            '&': { backgroundColor: 'black' },
        }),
        oneDark,
        json(),
    ]);

    return <div ref={ref} class="h-full" />;
};
