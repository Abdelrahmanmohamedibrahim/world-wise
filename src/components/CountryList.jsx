import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { UseCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = UseCities();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message="empty" />;
  const countriesUnique = new Set(
    cities.map((city) =>
      JSON.stringify({
        country: city.country,
        emoji: city.emoji,
      })
    )
  );
  const countries = [...countriesUnique].map((each) => JSON.parse(each));
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CityList;
