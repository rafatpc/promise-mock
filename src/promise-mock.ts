import { CallbackFn } from './types';

export class PromiseMock {
    private results: any[] = [];
    private callbackPointer: number = 0;
    private uncaughtError: boolean = false;

    constructor(callback: CallbackFn, private resultsMock: any[] = []) {
        callback(
            result => this.registerCallback(result),
            error => this.registerError(error)
        );
    }

    then(callback: CallbackFn): PromiseMock {
        if (this.uncaughtError) {
            return this;
        }

        return this.invokeCallback(callback);
    }

    catch(callback: CallbackFn): PromiseMock {
        if (!this.uncaughtError) {
            return this;
        }

        this.uncaughtError = false;

        return this.invokeCallback(callback);
    }

    finally(callback: CallbackFn): PromiseMock {
        return this.invokeCallback(callback);
    }

    private invokeCallback(callback: CallbackFn): PromiseMock {
        this.callbackPointer++;

        try {
            const lastResult: any = this.resultsMock[this.callbackPointer - 1] || this.results.slice().pop();
            const result: any = callback(lastResult);
            this.registerCallback(this.resultsMock[this.callbackPointer] || result);
        } catch (error) {
            this.registerError(this.resultsMock[this.callbackPointer] || error);
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

    static resolve(value: any, resultsMock?: any[]): PromiseMock {
        return new PromiseMock(resolve => resolve(value), resultsMock);
    }

    static reject(error: string | Error, resultsMock?: any[]): PromiseMock {
        return new PromiseMock((resolve, reject) => reject(error), resultsMock);
    }
}
