import {Callback, CallbackFn, CallbackType} from './types';

export class PromiseMockStep {
    private results: any[] = [];
    private uncaughtError: boolean = false;

    private finallyCallbacks: Callback[] = [];
    private callbacks: Callback[] = [];

    constructor(callback: CallbackFn) {
        callback(
            result => this.registerCallback(result),
            error => this.registerError(error)
        );
    }

    then(callback: CallbackFn): PromiseMockStep {
        return this.addCallback(CallbackType.Then, callback);
    }

    catch(callback: CallbackFn): PromiseMockStep {
        return this.addCallback(CallbackType.Catch, callback);
    }

    finally(callback: CallbackFn): PromiseMockStep {
        return this.addCallback(CallbackType.Finally, callback);
    }

    next(argsMock?: any): void {
        let type = CallbackType.Then;

        if (this.uncaughtError) {
            type = CallbackType.Catch;
        }

        const callback = this.getNextCallback(type);

        if (callback !== null) {
            if (type === CallbackType.Catch) {
                this.uncaughtError = false;
            }

            this.invokeCallback(callback, argsMock);
        }
    }

    private getNextCallback(type: string) {
        const callback = this.findCallback(this.callbacks, type);

        if (callback) {
            return callback;
        }

        return this.findCallback(this.finallyCallbacks, CallbackType.Finally);
    }

    private findCallback(stack: Callback[], type: string): CallbackFn | null {
        while (stack.length > 0) {
            const callback: Callback | null = stack.shift() ?? null;

            if (!callback) {
                return null
            }

            if (callback[0] === type) {
                return callback[1];
            }
        }

        return null;
    }

    private addCallback(type: CallbackType, callback: CallbackFn) {
        if (type === CallbackType.Finally) {
            this.finallyCallbacks.push([type, callback]);
            return this;
        }

        this.callbacks.push([type, callback]);
        return this;
    }

    private invokeCallback(callback: CallbackFn, argsMock?: any): PromiseMockStep {
        try {
            const lastResult: any = argsMock || this.results.slice().pop();
            const result: any = callback(lastResult);
            this.registerCallback(result);
        } catch (error) {
            this.registerError(error);
        }

        return this;
    }

    private registerCallback(result) {
        this.results.push(result);
    }

    private registerError(error) {
        this.results.push(error);
        this.uncaughtError = true;
    }

    static resolve(value: any): PromiseMockStep {
        return new PromiseMockStep(resolve => resolve(value));
    }

    static reject(error: string | Error): PromiseMockStep {
        return new PromiseMockStep((resolve, reject) => reject(error));
    }
}
