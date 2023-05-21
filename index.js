const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORt || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send('Hiii')
})

app.listen(port, () => {
    console.log(port)
})