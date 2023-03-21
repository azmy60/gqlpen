type EventHandler = (payload: any) => void;

interface EventBus {
    on(key: string, handler: EventHandler): void;
    off(key: string, handler: EventHandler): void;
    emit(key: string, ...payload: Parameters<EventHandler>): void;
    once(key: string, handler: EventHandler): void;
}

type Bus = Record<string, EventHandler[]>;

export function createEventBus(config?: {
    onError: (...params: any[]) => void;
}): EventBus {
    const bus: Bus = {};

    const off: EventBus['off'] = (key, handler) => {
        const index = bus[key]?.indexOf(handler) ?? -1;
        bus[key]?.splice(index >>> 0, 1);
    };

    const on: EventBus['on'] = (key, handler) => {
        if (!bus[key]) bus[key] = [];
        bus[key]?.push(handler);
    };

    const emit: EventBus['emit'] = (key, ...payload) => {
        bus[key]?.forEach((handler) => {
            try {
                handler(payload);
            } catch (e) {
                config?.onError(e);
            }
        });
    };

    const once: EventBus['once'] = (key, handler) => {
        const handleOnce = (...payload: Parameters<typeof handler>) => {
            handler(payload);
            off(key, handleOnce as typeof handler);
        };
        on(key, handleOnce as typeof handler);
    };

    return { on, off, emit, once };
}
