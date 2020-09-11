# PromiseMock

Unit tests mocks made easy!

```
PromiseMock.resolve(null, [
    { mock: 'first-one!' },
    { mock: 'second-one!' },
    { mock: 'catch-me!' },
]).then(result => {
    console.log(result); // { mock: 'first-one!' }
}).then(result => {
    console.log(result); // { mock: 'second-one!' }
    throw new Error('Oh, no!');
}).catch(result => {
    console.log(result); // { mock: 'catch-me!' }
});
```
or no mock...
```
PromiseMock.resolve('initial').then(result => {
    console.log(result); // initial
    return 42;
}).then(result => {
    console.log(result); // 42
});
```

More documentation coming soon, sorry!
