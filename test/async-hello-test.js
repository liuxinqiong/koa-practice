const assert = require('assert');

const hello = require('./async-hello');

describe('#async-.js', () => {
    it('#async function', async () => {
        let r = await hello();
        assert.strictEqual(r, 15);
    });
})