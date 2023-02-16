import { Component, For, ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { globalStore, setGlobalStore } from './state';

const MODAL_ID = 'header-settings-modal';

export const HeaderSettingsModalButton: ParentComponent = ({ children }) => (
    <label for={MODAL_ID}>{children}</label>
);

export const HeaderSettingsModal: Component = () => {
    return (
        <Portal>
            <input type="checkbox" id={MODAL_ID} class="modal-toggle" />
            <label for={MODAL_ID} class="modal cursor-pointer">
                <div class="modal-box">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <h4 class="font-bold">Introspection Headers</h4>
                            <For each={globalStore.introspectionHeaders}>
                                {({ key, value }, i) => (
                                    <div class="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) =>
                                                setGlobalStore(
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
                                                setGlobalStore(
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
                            <For each={globalStore.queryHeaders}>
                                {({ key, value }, i) => (
                                    <div class="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) =>
                                                setGlobalStore(
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
                                                setGlobalStore(
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
                        <label for={MODAL_ID} class="btn">
                            Close
                        </label>
                    </div>
                </div>
            </label>
        </Portal>
    );
};
