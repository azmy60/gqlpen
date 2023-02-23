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
import { schema } from './graphql';

const fullHeight = EditorView.theme({ '&': { height: '100%' } });

export const CodeEditor: Component<{
    onCtrlEnter: () => void;
    class?: string;
}> = (props) => {
    const { ref, createExtension, editorView } = createCodeMirror({
        onValueChange: (value) => setGlobalStore('sheets', globalStore.activeSheet, 'content', value),
    });

    createEditorControlledValue(editorView, () => globalStore.sheets[globalStore.activeSheet].content);
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
                    props.onCtrlEnter();
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
        if (editorView() && schema()) {
            updateSchema(editorView(), schema()!);
            editorView().focus();
        }
    });

    return <div ref={ref} class={props.class}/>;
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
