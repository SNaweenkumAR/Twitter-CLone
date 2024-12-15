const express = require('express');
const app = express();
const PORT = 3500;

app.get('/', (req,res) => {
    res.send("Hello")
})






app.listen(PORT,() => {console.log(`Server Running at localhost:${PORT}`)})          