import React, { useState } from "react";
import axios from "axios";

function FlightForm() {
  const [flightNumber, setFlightNumber] = useState("");
  const [originLocation, setOriginLocation] = useState("");
  const [flightData, setFlightData] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlightData(null);
    setTravelTime(null);

    if (!flightNumber || !originLocation) {
      setError("Please provide both flight number and your current location.");
      return;
    }

    try {
      // 1) Fetch flight info
      const flightResponse = await axios.get("http://localhost:5173/api/flight-info", {
        params: { flightNumber },
      });
      const retrievedFlightData = flightResponse.data;

      // 2) Fetch travel time to arrival airport
      const arrivalAirport = retrievedFlightData.arrivalAirport; // e.g. "O'Hare International Airport"
      // For Distance Matrix, we really need the city name or address. 
      // This might require additional data from the flight API to get the actual IATA code 
      // or address. For demonstration, let's assume `arrivalAirport` can be used directly.

      const travelResponse = await axios.get("http://localhost:5000/api/travel-time", {
        params: {
          origin: originLocation,
          destination: arrivalAirport,
        },
      });
      const retrievedTravelTime = travelResponse.data;

      setFlightData(retrievedFlightData);
      setTravelTime(retrievedTravelTime);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch flight or travel data. Check console for details.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Flight Number:</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="e.g., UA123"
          />
        </div>
        <div>
          <label>Your Location:</label>
          <input
            type="text"
            value={originLocation}
            onChange={(e) => setOriginLocation(e.target.value)}
            placeholder="e.g., Chicago, IL"
          />
        </div>
        <button type="submit">Track Flight</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {flightData && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Flight Info:</h2>
          <p>Airline: {flightData.airline}</p>
          <p>Flight Number: {flightData.flightNumber}</p>
          <p>Departure Airport: {flightData.departureAirport}</p>
          <p>Arrival Airport: {flightData.arrivalAirport}</p>
          <p>Scheduled Arrival: {flightData.scheduledArrival}</p>
          <p>Status: {flightData.flightStatus}</p>
        </div>
      )}

      {travelTime && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Travel Time to Airport:</h2>
          <p>Distance: {travelTime.distanceText}</p>
          <p>Duration: {travelTime.durationText}</p>
        </div>
      )}
    </div>
  );
}

export default FlightForm;
