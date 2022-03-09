const express = require('express')
const router = express.Router()
const {body, validationResult, query} = require('express-validator')
const db = require('../models')
const auth = require('../middleware/auth')

const ShortUrlService = require('../services/shortUrl')

/* GET short url listing. */
router.get('/', auth, ShortUrlService.list)

router.post('/', auth,
    body('name').not().isEmpty().withMessage('name required'),
    body('short_url').not().isEmpty().withMessage('short_url required'),
    body('original_url').not().isEmpty().withMessage('original_url required')
        .custom(value => {
            let url
            try {
                url = new URL(value)
            } catch (e) {
                url = false
            }
            return url !== false;
        })
        .withMessage('original_url not a url, please using http or https followed by domain.'),
    ShortUrlService.add)

router.put('/', auth,
    query('id').not().isEmpty().withMessage('id required.'),
    query('short_url')
        .custom(value => {
            return db.ShortUrl.findAll({
                where: {
                    short_url: value
                }
            }).then(data => {
                if (data.length > 0) {
                    throw ('short_url not available')
                }
            })
        }).withMessage('short_url not available'),
    ShortUrlService.edit)

router.delete('/', auth,
    query('id').not().isEmpty().withMessage('id required.'),
    ShortUrlService.deleteData)

module.exports = router
