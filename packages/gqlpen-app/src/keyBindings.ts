import { createEventBus } from './EventBus';

export const keyBindings = createEventBus();

function handleKeyDown(e: KeyboardEvent) {
    const key =
        (e.ctrlKey ? 'ctrl+' : '') +
        (e.shiftKey ? 'shift+' : '') +
        e.key.toLowerCase();
    keyBindings.emit(key, undefined);
}

export function listenKeybindings() {
    window.addEventListener('keydown', handleKeyDown);
}

export function unsubscribeKeybindings() {
    window.removeEventListener('keydown', handleKeyDown);
}
