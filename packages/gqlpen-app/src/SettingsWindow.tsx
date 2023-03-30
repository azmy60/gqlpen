import { Icon } from 'solid-heroicons';
import { plus, xMark } from 'solid-heroicons/solid';
import { type Component, For, onMount } from 'solid-js';
import { produce } from 'solid-js/store';
import { globalStore, setGlobalStore } from './state';

const SettingsWindow = () => {
    const handleEndpointInput = (event: InputEvent) => {
        setGlobalStore('endpoint', (event.target as HTMLInputElement).value);
    };

    const handleAddHeader = (type: 'introspectionHeaders' | 'queryHeaders') => {
        setGlobalStore(
            type,
            produce((headers) => {
                headers.push({ key: '', value: '' });
            })
        );
    };

    const handleIntrospectionInput = (
        event: InputEvent,
        index: number,
        key: 'key' | 'value'
    ) => {
        setGlobalStore(
            'introspectionHeaders',
            index,
            key,
            (event.target as HTMLInputElement).value
        );
    };

    const handleQueryInput = (
        event: InputEvent,
        index: number,
        key: 'key' | 'value'
    ) => {
        setGlobalStore(
            'queryHeaders',
            index,
            key,
            (event.target as HTMLInputElement).value
        );
    };

    const handleRemoveHeader = (
        type: 'introspectionHeaders' | 'queryHeaders',
        index: number
    ) => {
        setGlobalStore(
            type,
            produce((headers) => {
                headers.splice(index, 1);
            })
        );
    };

    let endpointInput: HTMLInputElement;

    onMount(() => {
        endpointInput.focus();
    });

    return (
        <div class="flex flex-col gap-8">
            <div class="form-control w-full">
                <label class="label">
                    <span class="label-text">Endpoint</span>
                </label>
                <input
                    type="text"
                    class="input-bordered input w-full"
                    value={globalStore.endpoint}
                    onInput={handleEndpointInput}
                    ref={endpointInput!}
                />
            </div>
            <div class="flex flex-col gap-[1.375rem]">
                <h3 class="font-semibold text-white">Introspection Headers</h3>
                <For each={globalStore.introspectionHeaders}>
                    {(header, i) => (
                        <div class="flex items-center gap-2">
                            <div class="flex gap-[1.375rem]">
                                <KeyValueInputs
                                    keyValue={header.key}
                                    valueValue={header.value}
                                    handleKeyInput={(event) =>
                                        handleIntrospectionInput(
                                            event,
                                            i(),
                                            'key'
                                        )
                                    }
                                    handleValueInput={(event) =>
                                        handleIntrospectionInput(
                                            event,
                                            i(),
                                            'value'
                                        )
                                    }
                                />
                            </div>
                            <button
                                onClick={() =>
                                    handleRemoveHeader('introspectionHeaders', i())
                                }
                            >
                                <Icon class="h-5 w-5" path={xMark} />
                            </button>
                        </div>
                    )}
                </For>
                <button
                    onClick={() => handleAddHeader('introspectionHeaders')}
                    class="btn-outline btn"
                >
                    <Icon class="h-6 w-6" path={plus} />
                    Add header
                </button>
            </div>
            <div class="flex flex-col gap-[1.375rem]">
                <h3 class="font-semibold text-white">Query Headers</h3>
                <For each={globalStore.queryHeaders}>
                    {(header, i) => (
                        <div class="flex items-center gap-2">
                            <div class="flex gap-4">
                                <KeyValueInputs
                                    keyValue={header.key}
                                    valueValue={header.value}
                                    handleKeyInput={(event) =>
                                        handleQueryInput(event, i(), 'key')
                                    }
                                    handleValueInput={(event) =>
                                        handleQueryInput(event, i(), 'value')
                                    }
                                />
                            </div>
                            <button
                                onClick={() =>
                                    handleRemoveHeader('queryHeaders', i())
                                }
                            >
                                <Icon class="h-5 w-5" path={xMark} />
                            </button>
                        </div>
                    )}
                </For>
                <button
                    onClick={() => handleAddHeader('queryHeaders')}
                    class="btn-outline btn"
                >
                    <Icon class="h-6 w-6" path={plus} />
                    Add header
                </button>
            </div>
        </div>
    );
};

const KeyValueInputs: Component<{
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

export default SettingsWindow;
