const express = require('express')
const router = express.Router()
const {index, createProcess, audioPage, statusOfProcessAudio, videoPage, statusOfProcessVideo} = require('../controllers/controllers')

router.route('/home').get(index)
router.route('/search').get(createProcess)

router.route('/audio').get(statusOfProcessAudio)
router.route('/audiopage').get(audioPage)

router.route('/video').get(statusOfProcessVideo)
router.route('/videopage').get(videoPage)

module.exports = router