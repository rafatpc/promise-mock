export type CallbackFn = Function;

export enum CallbackType {
    Then = 'then',
    Catch = 'catch',
    Finally = 'finally'
};

export type Callback = [CallbackType, CallbackFn];
