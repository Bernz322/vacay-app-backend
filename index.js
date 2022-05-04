require('dotenv').config()
const express = require('express')
const db = require("./models");
const path = require('path')

const PORT = process.env.PORT || 8000

// Routes
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
const reservationRoutes = require('./routes/reservationRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve all static files first
app.use(express.static(path.resolve('../client/build')))

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/reservation', reservationRoutes)
app.use('/api/review', reviewRoutes)

// Catch all remaining req that are not recognized and returns it to the React App, so it can handle routing
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
// })

db.sequelize.sync().then((req) => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})