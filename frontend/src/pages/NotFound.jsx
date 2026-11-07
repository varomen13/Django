import { Link } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'

export default function NotFound() {
  return (
    <main className="auth-card">
      <Header as="h1">Página no encontrada</Header>
      <p>La ruta que buscas no existe.</p>
      <Button as={Link} to="/" primary>Volver al inicio</Button>
    </main>
  )
}
