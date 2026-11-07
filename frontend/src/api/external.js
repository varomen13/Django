const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=29.0729&longitude=-110.9559&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=America%2FHermosillo'

export async function getWeatherApi() {
  const response = await fetch(WEATHER_URL)
  if (!response.ok) {
    throw new Error(`No se pudo consultar el clima (HTTP ${response.status}).`)
  }
  return response.json()
}
