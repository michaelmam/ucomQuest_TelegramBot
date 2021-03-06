const express = require('express');
const Users = require('./user.schema')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await Users.aggregate([
    {
      $lookup:
        {
          from: "users",
          localField: "adminId",
          foreignField: "_id",
          as: "admin"
        }
    },
    {
      $addFields: {adminData: { $arrayElemAt: [ "$admin", 0 ] }}
    },
    {$project: {admin: 0}},
    {
      $lookup:
        {
          from: "locations",
          localField: "playingLocationId",
          foreignField: "_id",
          as: "location"
        }
    },
    {
      $addFields: {locationData: { $arrayElemAt: [ "$location", 0 ] }}
    },
    {$project: {location: 0}},
    { $sort : { role : -1 } }
  ])
  res.json(users)
})
router.get('/admins', (req, res) => {
  Users.find({role: 'admin'}).sort({role: -1}).then(r => {
    res.json(r)
  })
})
router.post('/', async (req, res) => {
  const user = await Users.findOne({ $or: [{code: req.body.code}, {verificationCode: req.body.verificationCode}]})
  if (user && (user.code || user.verificationCode)) {
    res.json({error: 'use other code'})
  } else {
    const newUser = new Users({...req.body, ...req.body.admin});
    if (newUser.role === 'player') {
      newUser.playStatus = 'goingLocation'
    }
      const user = await newUser.save()
    res.json(user)
  }
})
router.put('/info/:id', async (req, res) => {
  await Users.updateOne({_id: req.params.id}, { $unset: { id: ""} });
  res.json(true)
})
router.put('/', async (req, res) => {
  const user = await Users.findOne({ $or: [{code: req.body.code}, {verificationCode: req.body.verificationCode}]})
  if (user && (user.code || user.verificationCode) && user._id.toString() !== req.body._id) {
    res.json({error: 'use other code'})
  } else {
    const user = await Users.updateOne({_id: req.body._id}, {...req.body, ...req.body.admin});
    res.json(user)
  }
})
router.delete('/:id', async (req, res) => {
  await Users.deleteOne({_id: req.params.id})
  res.json(true)
})

const getUserInfo = async (code) => {
  return Users.aggregate([
    {
      $match: {code}
    },
    {
      $lookup:
        {
          from: "locations",
          localField: "playingLocationId",
          foreignField: "_id",
          as: "location"
        }
    },
    {
      $addFields: {locationData: { $arrayElemAt: [ "$location", 0 ] }}
    },
    {$project: {location: 0}},
    {
      $lookup:
        {
          from: "games",
          localField: "playingGameId",
          foreignField: "_id",
          as: "game"
        }
    },
    {
      $addFields: {gameData: { $arrayElemAt: [ "$game", 0 ] }}
    },
    {$project: {game: 0}},
  ])
}

const getOnlyPLayers = () => {
  return Users.find({role: 'player'})
}

const userAggregate = (aggregate) => {
  return Users.aggregate([...aggregate])
}

const getUserById = async (id) => {
  return Users.findOne({id});
}
const updateUser = async ({id, data}) => {
  return Users.updateOne({id}, data)
}
const getUserByCode = async (code) => {
  return Users.findOne({code});
}
const getUserByVerificationCode = async (verificationCode) => {
  return Users.findOne({verificationCode});
}


module.exports = {
  router,
  userAggregate,
  getOnlyPLayers,
  getUserByVerificationCode,
  getUserInfo,
  getUserById,
  updateUser,
  getUserByCode
};
