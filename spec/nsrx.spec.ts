import { distinctUntilChanged, first, map, shareReplay } from 'rxjs/operators';
import { NsrxState } from '../src/nsrx';

describe('nxrs', () => {

    it('should success', async () => {
        const counterState = new class extends NsrxState<{ value: number }>  {
            public readonly value$ = this.state$.pipe(map(s => s.value), distinctUntilChanged(), shareReplay(1));

            public readonly increase = this.reducer<{ amount: number }>('Increase',
                (state, setState, payload) => setState({ value: (state?.value || 0) + payload.amount }));

            constructor() {
                super('counter');
            }
        }

        counterState.increase({ amount: 10 });
        expect(await counterState.value$.pipe(first()).toPromise()).toBe(10);
    });
});