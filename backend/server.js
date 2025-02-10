require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());       // Allows requests from your React dev server
app.use(express.json());

// GET /api/flights?dep_iata=JFK&arr_iata=LAX
app.get("/api/flights", async (req, res) => {
  try {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    const { dep_iata, arr_iata } = req.query;

    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${dep_iata}&arr_iata=${arr_iata}`;
    const response = await axios.get(url);

    // AviationStack returns { pagination: {...}, data: [...] }
    const flightsArray = response.data.data; // <--- the actual array

    // Return just the flights array so the frontend can do flights.map(...)
    res.json(flightsArray);
  } catch (error) {
    console.error("Error fetching data from AviationStack:", error.response?.data || error.message);
    return res.status(500).json({ error: "Server error fetching flights." });
  }
});

// Start server on port 5000 (or your choice)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
