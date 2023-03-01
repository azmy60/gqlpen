import { Icon } from 'solid-heroicons';
import { plus } from 'solid-heroicons/solid';
import { For } from 'solid-js';
import { produce } from 'solid-js/store';
import { KeyValueInputs } from './components';
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
                                keyValue={header.key}
                                valueValue={header.value}
                                handleKeyInput={(event) =>
                                    handleIntrospectionInput(event, i(), 'key')
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

export default SettingsWindow;
