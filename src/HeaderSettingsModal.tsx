import { Component, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { appStore, setAppStore } from './state';

const HeaderSettingsModal: Component = () => {
    return (
        <Portal>
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <label for="my-modal" class="modal cursor-pointer">
                <div class="modal-box">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <h4 class="font-bold">Introspection Headers</h4>
                            <For each={appStore.introspectionHeaders}>
                                {({ key, value }, i) => (
                                    <div class="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) =>
                                                setAppStore(
                                                    'introspectionHeaders',
                                                    i(),
                                                    'key',
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                )
                                            }
                                            class="input-bordered input input-sm grow"
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                setAppStore(
                                                    'introspectionHeaders',
                                                    i(),
                                                    'value',
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                )
                                            }
                                            class="input-bordered input input-sm grow"
                                        />
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="flex flex-col gap-2">
                            <h4 class="font-bold">Query Headers</h4>
                            <For each={appStore.queryHeaders}>
                                {({ key, value }, i) => (
                                    <div class="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) =>
                                                setAppStore(
                                                    'queryHeaders',
                                                    i(),
                                                    'key',
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                )
                                            }
                                            class="input-bordered input input-sm grow"
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                setAppStore(
                                                    'queryHeaders',
                                                    i(),
                                                    'value',
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                )
                                            }
                                            class="input-bordered input input-sm grow"
                                        />
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>

                    <div class="modal-action">
                        <label for="my-modal" class="btn">
                            Close
                        </label>
                    </div>
                </div>
            </label>
        </Portal>
    );
};

export default HeaderSettingsModal;
