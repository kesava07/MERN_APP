const express = require('express');
const app = express();
const connectDB = require('./config/db');

connectDB();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.get("/", (req, res) => {
    res.send("Api is working");
});

app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/posts", require('./routes/api/posts'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/users", require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at ${PORT} port`));