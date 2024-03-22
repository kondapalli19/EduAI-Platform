const express = require('express');
const app = express();
const path = require("path");
const hbs = require('hbs');
const collection = require('./mongodb');
const axios = require('axios'); // for making HTTP requests
const templatePath = path.join(__dirname, '../templates');

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// Your ZeroBounce API key
const ZEROBOUNCE_API_KEY = 'YOUR_ZERO_BOUNCE_API';

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate email using ZeroBounce API
        const response = await axios.get(`https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`);
        
        if (response.data.status === 'valid') {
            // Email is valid, proceed with signup
            // Check if email already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                // User already exists, show alert
                const errorMessage = "Email already exists";
                return res.send(`<script>alert('${errorMessage}'); window.location='/signup';</script>`);
            }

            const data = {
                name,
                email,
                password
            };

            await collection.insertMany([data]);

            res.render("home");
        } else {
            // Invalid email, show error message
            const errorMessage = "Invalid email";
            return res.send(`<script>alert('${errorMessage}'); window.location='/signup';</script>`);
        }
    } catch (error) {
        // Error occurred during email validation
        console.error("Error during email validation:", error);
        return res.send("<script>alert('Error occurred during email validation'); window.location='/signup';</script>");
    }
});

app.post("/login", async (req, res) => {
    // Login logic
});

app.listen(3000, () => {
    console.log("port connected on 3000");
});
