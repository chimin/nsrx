import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

let rootState: Record<string, any>;
const store$ = new ReplaySubject<Record<string, any>>(1);
const action$ = new Subject<{ action: string, payload: any, rootState: any }>();

export class NsrxState<S> {
    readonly state$ = this.memoize(store$.pipe(map(rs => rs?.[this.path] as S)));

    static attach<T>(plugin: (
        store$: Subject<Record<string, any>>,
        action$: Subject<{ action: string, payload: any, rootState: any }>
    ) => T) {
        return plugin(store$, action$);
    }

    constructor(public readonly path: string) { }

    protected reducer(action: string, callback: (state: S, setState: (newState: S) => S) => void): () => void;
    protected reducer<P>(action: string, callback: (state: S, setState: (newState: S) => S, payload: P) => void): (payload: P) => void;
    protected reducer<P>(action: string, callback: (state: S, setState: (newState: S) => S, payload: P) => void): (payload: P) => void {
        return payload => {
            const state = rootState?.[this.path];
            callback(state, newState => {
                rootState = { ...rootState, [this.path]: newState };
                store$.next(rootState);
                action$.next({ action, payload, rootState });
                return newState;
            }, payload);
        };
    }

    protected memoize<T>(observable: Observable<T>) {
        return observable.pipe(distinctUntilChanged(), shareReplay(1));
    }
}
