type EventHandler<T> = (payload: T) => void;
type Payload<K> = Parameters<EventHandler<K>>[0];

type EventCollection = Record<string, any>;
export type NoPayload = undefined;

interface EventBus<I extends EventCollection> {
    on<K extends keyof I>(key: K, handler: EventHandler<I[K]>): void;
    off<K extends keyof I>(key: K, handler: EventHandler<I[K]>): void;
    emit<K extends keyof I>(key: K, payload: Payload<I[K]>): void;
    once<K extends keyof I>(key: K, handler: EventHandler<I[K]>): void;
}

type Bus<I extends EventCollection> = {
    [K in keyof I]?: EventHandler<I[K]>[];
};

export function createEventBus<I extends EventCollection>(config?: {
    onError: (...params: any[]) => void;
}): EventBus<I> {
    const bus: Bus<I> = {};

    const off: EventBus<I>['off'] = (key, handler) => {
        const index = bus[key]?.indexOf(handler) ?? -1;
        bus[key]?.splice(index >>> 0, 1);
    };

    const on: EventBus<I>['on'] = (key, handler) => {
        if (!bus[key]) bus[key] = [];
        bus[key]?.push(handler);
    };

    const emit: EventBus<I>['emit'] = (key, payload) => {
        bus[key]?.forEach((handler) => {
            try {
                handler(payload);
            } catch (e) {
                config?.onError(e);
            }
        });
    };

    const once: EventBus<I>['once'] = (key, handler) => {
        const handleOnce = (payload: Payload<I[typeof key]>) => {
            handler(payload);
            off(key, handleOnce);
        };
        on(key, handleOnce);
    };

    return { on, off, emit, once };
}
