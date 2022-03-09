const express = require('express')
const router = express.Router()

const ShortUrlService = require('../services/shortUrl')

/* GET short url listing. */
router.get('/', ShortUrlService.list)
router.post('/', ShortUrlService.add)
router.put('/', ShortUrlService.edit)
router.delete('/', ShortUrlService.deleteData)

module.exports = router
