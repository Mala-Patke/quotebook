//Curl is dumb
const axios = require('axios').default;
let args = process.argv.slice(2);
args[1] = `http://localhost:3000${args[1]}`
axios[args[0]].call('a', ...args.slice(1))
    .then(({ data }) => console.log(data))
    .catch(({response}) => console.error(response.data));