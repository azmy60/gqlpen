import { type Component } from "solid-js";

export const KeyValueInputs: Component<{
    keyValue: string;
    valueValue: string;
    handleKeyInput: (event: InputEvent) => void;
    handleValueInput: (event: InputEvent) => void;
}> = (props) => {
    return (
        <>
            <input
                type="text"
                class="input-bordered input w-full"
                placeholder="Key"
                value={props.keyValue}
                onInput={props.handleKeyInput}
            />
            <input
                type="text"
                class="input-bordered input w-full"
                placeholder="Value"
                value={props.valueValue}
                onInput={props.handleValueInput}
            />
        </>
    );
};

