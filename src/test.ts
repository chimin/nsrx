import { fromEvent, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NsrxState } from './nsrx';
import { nsrxDevTools } from './nsrx.devtools';
import { nsrxLogger } from './nsrx.logger';

NsrxState.attach(nsrxDevTools);
NsrxState.attach(nsrxLogger);

interface CounterStateModel {
    autoIncreaseIsEnabled: boolean;
    value: number;
}

class CounterState extends NsrxState<CounterStateModel>{
    readonly value$ = this.memoize(this.state$.pipe(map(s => s.value)));
    readonly autoIncreaseIsEnabled$ = this.memoize(this.state$.pipe(map(s => s.autoIncreaseIsEnabled)));

    readonly init = this.reducer(
        `Init counter ${this.name}`,
        (_, setState) => setState({ autoIncreaseIsEnabled: false, value: 0 })
    );

    readonly increase = this.reducer<{ value: number }>(
        `Increase counter ${this.name}`,
        (state, setState, payload) => setState({ ...state, value: state.value + payload.value })
    );

    readonly enableAutoIncrease = this.reducer<{ isEnabled: boolean }>(
        `Enable auto increase counter ${this.name}`,
        (state, setState, payload) => {
            const newState = setState({ ...state, autoIncreaseIsEnabled: payload.isEnabled });

            this.subscription?.unsubscribe();
            if (newState.autoIncreaseIsEnabled) {
                this.subscription = interval(1000).subscribe(() => this.increase({ value: 1 }));
            }
        }
    )

    private subscription: Subscription;

    constructor(public readonly name: string) {
        super(`counter_${name}`);
        this.init();
    }
}

(() => {
    const chkIncrease = document.getElementById('chkIncrease') as HTMLInputElement;
    const txtCounter = document.getElementById('txtCounter') as HTMLInputElement;

    const counter = new CounterState('1');
    counter.value$.subscribe(c => txtCounter.value = String(c));
    counter.autoIncreaseIsEnabled$.subscribe(e => chkIncrease.checked = e);
    fromEvent(chkIncrease, 'click').subscribe(e => counter.enableAutoIncrease({ isEnabled: (e.target as HTMLInputElement).checked }));
})();

(() => {
    const chkIncrease = document.getElementById('chkIncrease2') as HTMLInputElement;
    const txtCounter = document.getElementById('txtCounter2') as HTMLInputElement;

    const counter = new CounterState('2');
    counter.value$.subscribe(c => txtCounter.value = String(c));
    counter.autoIncreaseIsEnabled$.subscribe(e => chkIncrease.checked = e);
    fromEvent(chkIncrease, 'click').subscribe(e => counter.enableAutoIncrease({ isEnabled: (e.target as HTMLInputElement).checked }));
})();

