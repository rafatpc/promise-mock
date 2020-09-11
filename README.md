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

More documentation coming soon, sorry!
