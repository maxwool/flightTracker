import React, { useState } from "react";
import axios from "axios";

function App() {
  // State for the selected departure and arrival IATA codes
  const [departureIata, setDepartureIata] = useState("");
  const [arrivalIata, setArrivalIata] = useState("");

  // State to store the fetched flights
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  // Hard-coded sample airports for the dropdown
  const airportOptions = [
    { label: "John F. Kennedy (JFK)", iata: "JFK" },
    { label: "Los Angeles (LAX)", iata: "LAX" },
    { label: "O'Hare Intl (ORD)", iata: "ORD" },
    { label: "San Francisco (SFO)", iata: "SFO" },
    // Add more if you like...
  ];

  const handleFetchFlights = async (e) => {
    e.preventDefault();
    setError("");
    setFlights([]);

    if (!departureIata || !arrivalIata) {
      setError("Please select both departure and arrival airports.");
      return;
    }

    try {
      // Example endpoint: http://localhost:5000/api/flights?dep_iata=JFK&arr_iata=LAX
      const response = await axios.get("http://localhost:5173/api/flights", {
        params: {
          dep_iata: departureIata,
          arr_iata: arrivalIata,
        },
      });
      setFlights(response.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching flights. Check console or server logs.");
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Flight Tracker</h1>
      <form onSubmit={handleFetchFlights} style={{ marginBottom: "1rem" }}>
        <div>
          <label>Departure Airport: </label>
          <select
            value={departureIata}
            onChange={(e) => setDepartureIata(e.target.value)}
          >
            <option value="">--Select--</option>
            {airportOptions.map((airport) => (
              <option key={airport.iata} value={airport.iata}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Arrival Airport: </label>
          <select
            value={arrivalIata}
            onChange={(e) => setArrivalIata(e.target.value)}
          >
            <option value="">--Select--</option>
            {airportOptions.map((airport) => (
              <option key={airport.iata} value={airport.iata}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Fetch Flights
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {flights.length > 0 ? (
        <div>
          <h2>Flight Results</h2>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Flight #</th>
                <th>Departure</th>
                <th>Scheduled Dep</th>
                <th>Arrival</th>
                <th>Scheduled Arr</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.airline}</td>
                  <td>{flight.flight_iata}</td>
                  <td>{flight.departure_airport}</td>
                  <td>{flight.departure_time}</td>
                  <td>{flight.arrival_airport}</td>
                  <td>{flight.arrival_time}</td>
                  <td>{flight.flight_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No flights to show yet.</p>
      )}
    </div>
  );
}

export default App;
