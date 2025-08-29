import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FULL_NAME = "abiskar_ghimire";
const DOB = "25022005";
const EMAIL = "ghimirra@gmail.com";
const ROLL_NUMBER = "22BCE3916";

function processData(data) {
    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let lettersOnly = [];

    data.forEach((item) => {
        let str = String(item).trim();

        if (/^-?\d+$/.test(str)) {
            let num = parseInt(str);
            if (num % 2 === 0) {
                even_numbers.push(str);
            } else {
                odd_numbers.push(str);
            }
            sum += num;
        } else if (/^[a-zA-Z]+$/.test(str)) {
            alphabets.push(str.toUpperCase());
            lettersOnly.push(...str.split('').map(char => char.toLowerCase()));
        } else if (str.length > 0) {
            special_characters.push(str);
        }
    });

    let concat_string = lettersOnly
        .reverse()
        .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
        .join("");

    return {
        is_success: true,
        user_id: `${FULL_NAME}_${DOB}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: sum.toString(),
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

        if (!Array.isArray(req.body.data) || req.body.data.length === 0) {
            return res.status(400).json({
                is_success: false,
                user_id: `${FULL_NAME}_${DOB}`,
                message: "'data' must be a non-empty array."
            });
        }

        const response = processData(req.body.data);
        res.status(200).json(response);
    } catch (err) {
        console.error("Error processing BFHL request:", err.stack);
        res.status(500).json({
            is_success: false,
            user_id: `${FULL_NAME}_${DOB}`,
            message: "Internal server error during data processing.",
            error_details: err.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Bajaj finserv API Running...");
});

app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        message: "Route not defined. Kindly check the endpoint or the method of request being done",
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled Error Caught by Middleware:", err.stack);
    res.status(500).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB}`,
        message: "Something went wrong on the server.",
        error_details: err.message || "Unknown error"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
