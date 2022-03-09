const express = require('express')
const router = express.Router()
const {body, validationResult} = require('express-validator')

const ShortUrlService = require('../services/shortUrl')

/* GET short url listing. */
router.get('/', ShortUrlService.list)

router.post('/',
    body('name').not().isEmpty().withMessage('name required'),
    body('short_url').not().isEmpty().withMessage('short_url required'),
    body('original_url').not().isEmpty().withMessage('original_url required')
        .custom((value) => {
            let url
            try {
                url = new URL(value)
            } catch (e) {
                url = false
            }
            return url === true;
        })
        .withMessage('original_url not a url, please using http or https followed by domain.'),
    ShortUrlService.add)

router.put('/', ShortUrlService.edit)
router.delete('/', ShortUrlService.deleteData)

module.exports = router