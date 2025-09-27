import {Subject, Subscription} from 'rxjs';
import {
    defaultEquals,
    SIGNAL,
    SIGNAL_NODE,
    signalGetFn,
    SignalNode,
    signalSetFn,
    signalUpdateFn
} from '@angular/core/primitives/signals';
import {ModelSignal} from "@angular/core";

export function value<T>(
    initialValue?: T,
): ModelSignal<T> {
    const node: SignalNode<T> = Object.create(SIGNAL_NODE);
    node.value = initialValue ?? null;
    node.equal = defaultEquals;

    const _subject = new Subject<T>();
    const subscriptions: Subscription[] = [];

    const getter = Object.assign(
        () => signalGetFn(node),
        {[SIGNAL]: node}
    ) as ModelSignal<T>;

    getter.set = (value: T) => {
        signalSetFn(node, value);
        _subject.next(value);
    };

    getter.update = (fn: (value: T) => T) => {
        signalUpdateFn(node, fn);
        _subject.next(node.value);
    };

    getter.subscribe = (callback: (value: T) => void) => {
        const sub = _subject.subscribe(callback);
        subscriptions.push(sub);
        return sub;
    };

    // @ts-ignore
    getter.destroy = () => {
        subscriptions.forEach(s => s.unsubscribe());
        subscriptions.length = 0;
        _subject.complete();
    };

    return getter;
}
