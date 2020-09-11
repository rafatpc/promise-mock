export class PromiseMock {
    private results: Array<any> = [];
    private callbackPointer: number = 0;
    private uncaughtError: boolean = false;

    constructor(callback: Function, private resultsMock: Array<any> = []) {
        callback(
            result => this.registerCallback(result),
            error => this.registerError(error)
        );
    }

    then(callback: Function): PromiseMock {
        if (this.uncaughtError) {
            return this;
        }

        return this.invokeCallback(callback);
    }

    catch(callback: Function): PromiseMock {
        if (!this.uncaughtError) {
            return this;
        }

        this.uncaughtError = false;

        return this.invokeCallback(callback);
    }

    private invokeCallback(callback: Function): PromiseMock {
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

    static resolve(value: any, resultsMock?: Array<any>): PromiseMock {
        return new PromiseMock(resolve => resolve(value), resultsMock);
    }

    static reject(error: string | Error, resultsMock?: Array<any>): PromiseMock {
        return new PromiseMock((resolve, reject) => reject(error), resultsMock);
    }
}
