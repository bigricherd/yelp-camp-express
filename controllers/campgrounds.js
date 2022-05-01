const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    // Loop over all campgrounds and generate a geoJSON with all the location data
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.new = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    newCampground.geometry = geoData.body.features[0].geometry;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    // console.log(res.locals.currentUser);
    if (!campground) {
        req.flash('error', 'That campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot edit a campground that does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { title, image, price, description, location } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title: title, image: image, price: price, description: description, location: location }, { new: true });
    const toDelete = req.body.deleteImages;
    if (toDelete) {
        for (let filename of toDelete) {
            await cloudinary.uploader.destroy(filename); // Removes image from cloudinary folder
        }
        campground.images = campground.images.filter((i) => !toDelete.includes(i.filename)); // My solution, also works.
        // await campground.updateOne({ $pull: { images: { filename: { $in: toDelete } } } }) // Colt's solution
    }
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImages);
    await campground.save();
    req.flash('success', `Successfully updated campground ${campground.title}`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    console.log(`Deleted campground ${deleted}`);
    req.flash('success', `Successfully deleted campground ${deleted.title}`);
    res.redirect('/campgrounds');
}