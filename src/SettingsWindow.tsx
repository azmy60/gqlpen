import { Icon } from 'solid-heroicons';
import { plus } from 'solid-heroicons/solid';
import { Component, For } from 'solid-js';
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
                />
            </div>
            <div class="flex flex-col gap-[1.375rem]">
                <h3 class="font-semibold text-white">Introspection Headers</h3>
                <For each={globalStore.introspectionHeaders}>
                    {(header, i) => (
                        <div class="flex gap-[1.375rem]">
                            <KeyValueInputs
                                type="introspectionHeaders"
                                index={i()}
                                keyValue={header.key}
                                valueValue={header.value}
                            />
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
                        <div class="flex gap-[1.375rem]">
                            <KeyValueInputs
                                type="queryHeaders"
                                index={i()}
                                keyValue={header.key}
                                valueValue={header.value}
                            />
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
    type: 'introspectionHeaders' | 'queryHeaders';
    index: number;
    keyValue: string;
    valueValue: string;
}> = (props) => {
    const handleInput = (event: InputEvent, key: 'key' | 'value') => {
        setGlobalStore(
            props.type,
            props.index,
            key,
            (event.target as HTMLInputElement).value
        );
    };

    return (
        <>
            <input
                type="text"
                class="input-bordered input w-full"
                placeholder="Key"
                value={props.keyValue}
                onInput={(event) => handleInput(event, 'key')}
            />
            <input
                type="text"
                class="input-bordered input w-full"
                placeholder="Value"
                value={props.valueValue}
                onInput={(event) => handleInput(event, 'value')}
            />
        </>
    );
};

export default SettingsWindow;
