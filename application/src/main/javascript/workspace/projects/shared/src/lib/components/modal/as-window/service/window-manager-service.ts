import { Injectable, Type, signal } from '@angular/core';

export interface WindowConfig {
    id: string;
    title: string;
    component: Type<unknown>;
    inputs?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
    windows = signal<WindowConfig[]>([]);

    open(window: WindowConfig) {
        this.windows.update(list => [...list, window]);
    }

    close(id: string) {
        this.windows.update(list => list.filter(w => w.id !== id));
    }
}
