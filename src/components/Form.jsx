// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import { UseUrlPosition } from "../hooks/UseUrlPosition";
import { UseCities } from "../contexts/CitiesContext";
const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const nav = useNavigate();
  const { lat, lng } = UseUrlPosition();
  const { createCity } = UseCities();
  const [loadingData, setLoadingData] = useState(false);
  const [displayError, setDisplayError] = useState("");
  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setLoadingData(true);
          setDisplayError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);
          if (!data.countryCode) {
            throw new Error(
              "this is not a country please click on somewhere else "
            );
          }
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
        } catch (err) {
          setDisplayError(err.message);
        } finally {
          setLoadingData(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,

      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    nav("/app/cities");
  }
  if (loadingData) return <Spinner />;
  if (!lat && !lng)
    return (
      <Message message={`please click on the needed position on the map`} />
    );
  if (displayError) return <Message message={displayError} />;
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        {/*<input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
  />*/}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            nav(-1);
          }}
        >
          {" "}
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
