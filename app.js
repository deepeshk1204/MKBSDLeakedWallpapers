
// const express = require('express');
// const exphbs = require('express-handlebars');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const port = 3000;
// const imagesFolder = path.join(__dirname, 'public/images');

// // Set up Handlebars
// app.engine('handlebars', exphbs.engine());
// app.set('view engine', 'handlebars');

// // Serve static files
// app.use(express.static('public'));

// // Main route
// app.get('/', (req, res) => {
//     // Read all image files from the folder
//     fs.readdir(imagesFolder, (err, files) => {
//         if (err) {
//             return res.status(500).send('Unable to read images');
//         }
//         // Filter only image files (jpg, png, gif, etc.)
//         const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
//         // Create the full image URLs
//         console.log('imageFiles',imageFiles);
        
//         const images = imageFiles.map(file => `/images/${file}`);
//         res.render('gallery', {layout: false, images });
//     });
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch'); // Use node-fetch to make HTTP requests

const app = express();
const port = 3000;
const imagesApiUrl = 'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s';

// Set up Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Serve static files
app.use(express.static('public'));

// Main route
app.get('/', async (req, res) => {
    try {
        // Fetch the JSON data from the URL
        const response = await fetch(imagesApiUrl);
        if (!response.ok) {
            return res.status(500).send('Unable to fetch images');
        }
        
        const jsonData = await response.json();
        const data = jsonData.data;
        
        if (!data) {
            return res.status(500).send('Invalid image data format');
        }

        // Extract the image URLs from the fetched data
        const images = [];
        for (const key in data) {
            const subproperty = data[key];
            if (subproperty && subproperty.dhd) {
                images.push(subproperty.dhd);
            }
        }

        // Render the gallery template and pass the images
        res.render('gallery', { layout: false, images });
    } catch (error) {
        console.error(`Error fetching images: ${error.message}`);
        res.status(500).send('Error fetching images');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
