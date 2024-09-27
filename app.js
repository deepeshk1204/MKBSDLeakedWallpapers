
const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const imagesFolder = path.join(__dirname, 'public/images');

// Set up Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Serve static files
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
    // Read all image files from the folder
    fs.readdir(imagesFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to read images');
        }
        // Filter only image files (jpg, png, gif, etc.)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        // Create the full image URLs
        console.log('imageFiles',imageFiles);
        
        const images = imageFiles.map(file => `/images/${file}`);
        res.render('gallery', {layout: false, images });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
