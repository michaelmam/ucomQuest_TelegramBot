const express = require('express');
const btoa = require('btoa');
const router = express.Router()
const {router: userRouter} = require('./api/user/user')
const {router: gameRouter} = require('./api/clue/clue')
const {router: clueRouter} = require('./api/clue/clue')
const {router: locationRouter} = require('./api/location/location')
const {router: fileRouter} = require('./api/file/file')
const {router: chatRouter} = require('./api/chat/chat')
const {router: leaderBoardRouter} = require('./api/leaderBoard/leaderBoard')

router.get('/', (req, res) => {
  res.send('app works')
})

router.use('/leaderboard', leaderBoardRouter)
router.use('/user', userRouter)
router.use('/location', locationRouter)
router.use('/game', gameRouter)
router.use('/clue', clueRouter)
router.use('/file', fileRouter)
router.use('/chat', chatRouter)
router.post('/login',  (req, res) => {

  if (req.body.name === process.env.loginUserName && req.body.password === process.env.loginUserPassword) {
    res.send({token: btoa(process.env.token)
    })
  } else {
    res.status(400).send(`user not found ${req.body.name}, ${req.body.password}`)
  }
})

module.exports = router;
