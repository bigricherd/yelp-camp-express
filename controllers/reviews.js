const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.new = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const { rating, body } = req.body.review;
    const newReview = new Review({ rating, body });
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', `You rated ${campground.title} ${rating} stars`)
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    const review = await Review.findById(reviewId);
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', `Deleted your ${review.rating} star review of ${campground.title}`);
    res.redirect(`/campgrounds/${id}`);
}