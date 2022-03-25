const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
require('dotenv').config()
//const {SERVER_PORT} = process.env
const PORT = process.env.PORT || 4000

const {seedDataBase, loginPart, registerPart, postMessage, showAllPosts, startNewGame, adminCheck, killGame, redSpy, blueSpy, redAgent, blueAgent,
     showTeams}= require("./controller.js")


//Middleware
app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname,"../build")))
//Endpoints
app.post("/api/seed", seedDataBase)

app.post("/api/login", loginPart)

app.post("/api/register", registerPart)

app.post("/api/post", postMessage)

app.post("/api/startNew", startNewGame)

app.post("/api/redSpy", redSpy)

app.post("/api/blueSpy", blueSpy)

app.post("/api/redAgent", redAgent)

app.post("/api/blueAgent", blueAgent)

app.get("/api/show", showAllPosts)

app.get("/api/adminCheck", adminCheck)

app.get("/api/killGame", killGame)

app.get("/api/showTeams", showTeams)


app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

app.listen(PORT, () => console.log(`up on ${PORT}`))