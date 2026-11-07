import { useEffect, useState } from 'react'
import { Card, Grid, Header, Icon, Message } from 'semantic-ui-react'
import { getWeatherApi } from '../api/external.js'
import { getCountryApi } from '../api/soap.js'
import { useAuth } from '../hooks/useAuth.jsx'

const WEATHER_DESCRIPTIONS = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  56: 'Llovizna helada ligera',
  57: 'Llovizna helada intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  66: 'Lluvia helada ligera',
  67: 'Lluvia helada intensa',
  71: 'Nieve ligera',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  77: 'Granos de nieve',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos intensos',
  85: 'Chubascos de nieve ligeros',
  86: 'Chubascos de nieve intensos',
  95: 'Tormenta',
  96: 'Tormenta con granizo ligero',
  99: 'Tormenta con granizo intenso',
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getWeatherApi()
      .then((data) => { if (active) setWeather(data.current) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <Card fluid className="widget-card">
      <Card.Content>
        <Header as="h2"><Icon name="cloud" /> Clima en Hermosillo</Header>
        {loading && <p>Cargando clima...</p>}
        {error && <Message error content={error} />}
        {weather && (
          <div>
            <Header as="h3">{weather.temperature_2m} °C</Header>
            <p className="weather-condition">{WEATHER_DESCRIPTIONS[weather.weather_code] || 'Condición meteorológica actual'}</p>
            <p className="widget-metric"><Icon name="tint" /> Humedad: {weather.relative_humidity_2m}%</p>
            <p className="widget-metric"><Icon name="compass" /> Viento: {weather.wind_speed_10m} km/h</p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

function CountryWidget({ token }) {
  const [country, setCountry] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getCountryApi(token)
      .then((data) => { if (active) setCountry(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [token])

  return (
    <Card fluid className="widget-card">
      <Card.Content>
        <Header as="h2"><Icon name="globe" /> Información SOAP</Header>
        {loading && <p>Consultando CountryInfoService...</p>}
        {error && <Message error content={error} />}
        {country && (
          <div className="country-details">
            <p><span className="country-detail-label">País</span><span className="country-detail-value">{country.nombre}</span></p>
            <p><span className="country-detail-label">Capital</span><span className="country-detail-value">{country.capital || 'No disponible'}</span></p>
            <p><span className="country-detail-label">Moneda</span><span className="country-detail-value">{country.moneda || 'No disponible'}</span></p>
            <p><span className="country-detail-label">Código telefónico</span><span className="country-detail-value">+{country.codigo_telefonico}</span></p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default function Dashboard() {
  const { auth } = useAuth()
  const { me, token } = auth
  const name = [me.first_name, me.last_name].filter(Boolean).join(' ') || me.username

  return (
    <>
      <main className="page-shell">
        <section className="welcome-card">
          <span className="welcome-kicker">Tu espacio de compras</span>
          <Header as="h1">Bienvenido, {name}</Header>
          <p className="welcome-details">
            <span>{me.email}</span>
            <span>Teléfono: {me.telefono || 'No registrado'}</span>
          </p>
        </section>
        <Grid stackable columns={2} className="widget-grid">
          <Grid.Column><WeatherWidget /></Grid.Column>
          <Grid.Column><CountryWidget token={token} /></Grid.Column>
        </Grid>
      </main>
      <footer className="dashboard-footer">© {new Date().getFullYear()} Tienda Online · Compra fácil, compra seguro.</footer>
    </>
  )
}
