// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// File where JSON data will be stored
const dataFilePath = path.join(__dirname, 'data.json');

// Check if data file exists, if not create an empty array
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf-8');
}

// Function to read data from file
const readDataFromFile = () => {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

// Function to write data to file
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// POST endpoint to add JSON data
app.post('/api/data', (req, res) => {
    const newData = req.body;

    // Read current data from file
    const data = readDataFromFile();

    // Add new data to array
    data.push(newData);

    // Write updated data back to file
    writeDataToFile(data);

    res.status(201).json(newData);
});

// GET endpoint to retrieve JSON data by ID
app.get('/api/data/:id', (req, res) => {
    const id = req.params.id;

    // Read current data from file
    const data = readDataFromFile();

    // Find data by ID
    const foundData = data.find(item => item.id === id);

    if (foundData) {
        res.json(foundData);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

// DELETE endpoint to delete JSON data by ID
app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;

    // Read current data from file
    let data = readDataFromFile();

    // Filter out data with the given ID
    data = data.filter(item => item.id !== id);

    // Write updated data back to file
    writeDataToFile(data);

    res.json({ message: 'Data deleted successfully' });
});

app.get('/', (req, res) => {
    res.json('Welcome to json server')
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
