// test.js
const myApp = require('./myApp');

const port = 3000;
myApp.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
});
