import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

export function nsrxLogger(
    store$: Subject<Record<string, any>>,
    action$: Subject<{ action: string, payload: any, rootState: any }>
) {
    store$.pipe(first()).subscribe(s => console.log(s));
    action$.subscribe(a => console.log(a));
}