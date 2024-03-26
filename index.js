const app = require('./src/app');
// LISTENER
const port = process.env.PORT || 9000;
app.listen(port, () => { console.log("App started at port ", port)});