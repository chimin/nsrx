# nsrx (not so redux)

I don't like existing Redux libraries so I just create my own. The goal is to use Redux with minimal boilerplate
and in a natural way.


## To start

1. Create a class extending `NxrsState<StateModel>`.
2. Call the super constructor with the path name you want.
3. Use `state$` to select the state.
    1. Or create your own selector with `this.state$.pipe(...)`.
    2. Add `distinctUntilChanged()` so it only publish changed value.
    3. Add `shareReplay(1)` so the value get cached for multiple subscriber.
4. Add action by using `this.reducer<Payload>(action, callback)`.
    1. `callback` accepts parameter `state`, `setState` and `payload`.
    2. It must use `setState` to modify the state before return.
5. If you want to use it in Angular, just annotate it with `@Injectable()` (https://angular.io/guide/dependency-injection).


## Simple Example

```typescript
class CounterState extends NsrxState<{ value: number }>  {
    public readonly value$ = this.state$.pipe(map(s => s.value), distinctUntilChanged(), shareReplay(1));

    public readonly increase = this.reducer<{ amount: number }>('Increase',
        (state, setState, payload) => setState({ value: (state?.value || 0) + payload.amount }));

    constructor() {
        super('counter');
    }
}

counterState.increase({ amount: 10 });
```


## Example with side effects

```typescript
class CounterState extends NsrxState<CounterStateModel>{
    readonly value$ = this.state$.pipe(map(s => s.value), distinctUntilChanged(), shareReplay(1));
    readonly autoIncreaseIsEnabled$ = this.state$.pipe(map(s => s.autoIncreaseIsEnabled), distinctUntilChanged(), shareReplay(1));

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
```


## Use it with Redux tools

```typescript
NsrxState.attach(nsrxDevTools);
```


## Log all state changes to console

```typescript
NsrxState.attach(nsrxLogger);
```