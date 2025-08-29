import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Change your details here
const FULL_NAME = "abiskar_ghimire";
const DOB = "25022005"; // ddmmyyyy
const EMAIL = "ghimirra@gmail.com";
const ROLL_NUMBER = "22BCE3916";

// This function processes the data array and returns the structured response.
function processData(data) {
    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let lettersOnly = []; // To collect individual letters for concat_string

    data.forEach((item) => {
        // Force everything to string to avoid crashes and ensure consistent regex matching
        let str = String(item).trim();

        if (/^-?\d+$/.test(str)) {
            // Numbers (string representation for output)
            let num = parseInt(str);
            if (num % 2 === 0) {
                even_numbers.push(str);
            } else {
                odd_numbers.push(str);
            }
            sum += num;
        } else if (/^[a-zA-Z]+$/.test(str)) {
            // Alphabets (strings like "A", "ABcD", "DOE")
            alphabets.push(str.toUpperCase());
            // Collect individual letters (lowercase for intermediate processing) for concat_string
            lettersOnly.push(...str.split('').map(char => char.toLowerCase()));
        } else if (str.length > 0) {
            // Special characters (or strings containing mixed types)
            special_characters.push(str);
        }
    });

    // Build alternating caps reverse string
    let concat_string = lettersOnly
        .reverse() // Reverse the array of individual letters
        .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())) // Apply alternating caps
        .join(""); // Join them back into a string

    return {
        is_success: true,
        user_id: `${FULL_NAME}_${DOB}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: sum.toString(), // Sum must be a string
        concat_string,
    };
}

app.post("/bfhl", (req, res) => {
    try {
        if (!req.body || !("data" in req.body)) {
            console.log("error in data body");
            return res.status(400).json({
                is_success: false,
                user_id: `${FULL_NAME}_${DOB}`,
                message: "Request body must contain a 'data' array field."
            });
        }

        // Validate that 'data' is an array and is not empty.
        // The original logic would proceed to processData with an empty array if data.length === 0,
        // which processData currently handles as a success.
        if (!Array.isArray(req.body.data) || req.body.data.length === 0) {
            return res.status(400).json({
                is_success: false,
                user_id: `${FULL_NAME}_${DOB}`, // Include user_id in error response as well
                message: "'data' must be a non-empty array."
            });
        }

        const response = processData(req.body.data);
        res.status(200).json(response);
    } catch (err) {
        console.error("Error processing BFHL request:", err.stack); // Log full stack trace
        res.status(500).json({
            is_success: false,
            user_id: `${FULL_NAME}_${DOB}`, // Include user_id in error response
            message: "Internal server error during data processing.",
            error_details: err.message
        });
    }
});

// Basic GET route for the root path
app.get("/", (req, res) => {
    res.send("Bajaj finserv API Running...");
});

// This middleware handles requests that didn't match any specific route
app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        message: "Route not found. Please use the /bfhl endpoint for POST requests.",
    });
});

// Error-handling middleware (must have 4 arguments: err, req, res, next)
app.use((err, req, res, next) => {
    console.error("Unhandled Error Caught by Middleware:", err.stack);
    res.status(500).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB}`, // Include user_id in global error response
        message: "Something went wrong on the server.",
        error_details: err.message || "Unknown error"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
