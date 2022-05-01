const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`;
})

// Middleware that runs after every Campground.findByIdDelete()
// deletes all the reviews associated with the deleted campground
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        // // MY RUDIMENTARY SOLUTION
        // if (campground.reviews.length) {
        //     for (let review of campground.reviews) {
        //         await Review.findByIdAndDelete(review._id);
        //     }
        // }
        // COLT'S SOLUTION: CLEANER BECAUSE YOU DON'T HAVE TO LOOP THROUGH THE ARRAY
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);