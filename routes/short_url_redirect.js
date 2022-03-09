const express = require('express')
const router = express.Router()

const ShortUrlService = require('../services/shortUrl')

/* Redirect user to original url. */
router.get('/', ShortUrlService.goToUrl)

module.exports = router
