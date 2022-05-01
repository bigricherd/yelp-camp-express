const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randLoc = Math.floor(Math.random() * 1000) + 1;
        const city = cities[randLoc];
        const randomPrice = Math.floor(Math.random() * 400) + 20;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)} `,
            images: [
                {
                    url: 'https://res.cloudinary.com/dbznurn9q/image/upload/v1651193874/YelpCamp/ao9jwj2nypxjthznfovy.webp',
                    filename: 'YelpCamp/ao9jwj2nypxjthznfovy'
                },
                {
                    url: 'https://res.cloudinary.com/dbznurn9q/image/upload/v1651193874/YelpCamp/njtq20v9fgm5adbhvdpb.webp',
                    filename: 'YelpCamp/njtq20v9fgm5adbhvdpb'
                }
            ],
            geometry: { "type": "Point", "coordinates": [city.longitude, city.latitude] },
            price: randomPrice,
            description: 'A quiet, naturey spot with lots of trees and worms and grub. You will be chilly at night unless you have a fire, just like any other campground. Courtesty of Schrute Farms.',
            location: `${city.city}, ${city.state} `,
            author: '62672b94e6c556a60ceab7bb'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})