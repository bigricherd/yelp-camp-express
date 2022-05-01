const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// CREATE NEW REVIEW AND ADD TO CAMPGROUND
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.new))

router.delete('/:reviewId', isReviewAuthor, catchAsync(reviews.delete))

module.exports = router;