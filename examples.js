const { PromiseMock, PromiseMockStep } = require('./dist/index');

// Make the promise synchronous:
const syncPromise = PromiseMock.resolve({ mock: 'first-one!' });

syncPromise
    .then(rs => {
        console.log(rs); // { mock: 'first-one!' }
        return 42;
    })
    .then(rs => {
        console.log(rs); // 42
    });

// Make the promise synchronous and mock the execution's chain results: 
const syncPromiseMocks = PromiseMock.resolve(null, [
    { mock: 'first-one!' },
    { mock: 'second-one!' },
    { mock: 'catch-me!' },
]);

syncPromiseMocks
    .then(rs => {
        console.log(rs); // { mock: 'first-one!' }
    })
    .then(rs => {
        console.log(rs); // { mock: 'second-one!' }
        throw new Error('Oh, no!');
    })
    .catch(rs => {
        console.log(result); // { mock: 'catch-me!' }
    });

const stepPromise = new PromiseMockStep.resolve({mock: 'data'});

stepPromise
    .then(rs => {
        console.log('First then:', rs);
        throw new Error('Thrown from first then.')
    })
    .then(rs => {
        console.log('Second then:', rs);
    })
    .catch(err => {
        console.log('First catch:', err.message);
        return 'feed next callback';
    })
    .finally(who => {
        console.log(`Finally comes last!\r\n-${who} 2020`);
    })
    .catch(err => {
        console.log('Second catch:', err.message);
    })
    .then(rs => {
        console.log('Third then:', rs);
    })
    .then(rs => {
        console.log('Last then:', rs);
    });

stepPromise.next(); // First then: { mock: 'data' }
stepPromise.next(); // First catch: Thrown from first then.
stepPromise.next(); // Third then: feed next callback
stepPromise.next({ swapData: true }); // Last then: { swapData: true }
stepPromise.next('Socrates'); // Finally comes last! -Socrates 2020
