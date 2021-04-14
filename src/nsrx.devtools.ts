import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

let devTools: {
    init: (state) => void,
    send: (action, state) => void,
    subscribe: (listener: (message) => void) => void
};

export function nsrxDevTools(
    store$: Subject<Record<string, any>>,
    action$: Subject<{ action: string, payload: any, rootState: any }>
) {
    if (devTools) {
        return true;
    }

    devTools = (window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect();
    if (!devTools) {
        return false;
    }

    store$.pipe(first()).subscribe(s => devTools.init(s));
    devTools.subscribe(message => {
        if (message.type == 'DISPATCH') {
            store$.next(JSON.parse(message.state));
        }
    });
    action$.subscribe(({ action, rootState }) => devTools?.send(action, rootState));
    return true;
}