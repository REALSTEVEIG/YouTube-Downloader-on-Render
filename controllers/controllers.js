const axios = require('axios')
const Downloads = require('../model/downloads')
const {StatusCodes} =require('http-status-codes')
const apiKey = process.env.API_KEY
let contentCode = ''

exports.index = (req, res) => {
    res.render('index')
}

exports.createProcess = async (req, res) => {

    try {
        const {url, format} = req.query

        if (!url) {
            return res.status(StatusCodes.BAD_REQUEST).render('index', {error : `Please provide a valid url.`})
        }

        const options = {
            method : 'GET',
            url : 'https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess',
            params : {
                url : url,
                format : format
            },
            headers : {
                'X-RapidAPI-Key' : apiKey,
                'X-RapidAPI-Host': 't-one-youtube-converter.p.rapidapi.com'
            }
        }
        const response = await axios.request(options)

        contentCode = response.data.guid

        const contentTitle  = response.data.YoutubeAPI.titolo

        const database = await Downloads.create({contentTitle})

       // console.log(contentCode, contentTitle)
       if (req.query.format === 'mp3') {
        return res.status(StatusCodes.OK).render('audio', {contentCode, contentTitle})
       }

       else if (req.query.format === 'video') {
        return res.status(StatusCodes.OK).render('video', {contentCode, contentTitle})
       }
       console.log(req.query.format)
    } catch (error) {
        //console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('index',{error : `Temporary problem with our server. Please try again later.`})
    }
}

exports.audioPage = (req, res) => {
  res.render('audio')
}

exports.statusOfProcessAudio = async (req, res) => {
  try {
    const options = {
        method: 'GET',
        url: 'https://t-one-youtube-converter.p.rapidapi.com/api/v1/statusProcess',
        params: {guid: contentCode, responseFormat: 'json', lang: 'it'},
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 't-one-youtube-converter.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options)
      //console.log(response.data) 
      return res.status(StatusCodes.OK).redirect(response.data.YoutubeAPI.urlMp3)
   
  } catch (error) {
      //console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('audio',{error : `Could not download the audio file you requested. Please provide a different url.`})
  }
}

exports.videoPage = (req, res) => {
  res.render('video')
}

exports.statusOfProcessVideo = async (req, res) => {
    try {
      const options = {
          method: 'GET',
          url: 'https://t-one-youtube-converter.p.rapidapi.com/api/v1/statusProcess',
          params: {guid: contentCode, responseFormat: 'json', lang: 'it'},
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 't-one-youtube-converter.p.rapidapi.com'
          }
        };
        
        const response = await axios.request(options)

        return res.status(StatusCodes.OK).redirect(response.data.YoutubeAPI.urlVideo)

    } catch (error) {
        //console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('video',{error : `Could not download the video file you requested. Please provide a different url.`})
    }
  }