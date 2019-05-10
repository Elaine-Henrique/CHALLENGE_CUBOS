const app = require('./src/app');

const port = process.env.PORT || '3000';

// Server Started
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
