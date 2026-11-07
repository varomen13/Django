import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Header, Icon, Message } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import { loginApi } from '../api/user.js'
import { useAuth } from '../hooks/useAuth.jsx'
import BrandPanel from '../components/BrandPanel.jsx'

const validationSchema = Yup.object({
  email: Yup.string().email('Ingresa un correo válido.').required('El correo es obligatorio.'),
  password: Yup.string().required('La contraseña es obligatoria.'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { access } = await loginApi(values.email, values.password)
        console.log('Token obtenido (access):', access)
        await login(access)
        navigate('/dashboard')
      } catch {
        toast.error('Usuario o contraseña incorrecta')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="auth-page">
      <BrandPanel />
      <main className="auth-form-panel">
        <section className="auth-card">
          <Header as="h1">Iniciar sesión</Header>
          <p className="muted">Accede a tu cuenta de Tienda Online.</p>
          <Form className="auth-form" onSubmit={formik.handleSubmit}>
            <Form.Field>
              <label htmlFor="email">Correo electrónico</label>
              <div className="store-input">
                <Icon name="envelope outline" aria-hidden="true" />
                <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" {...formik.getFieldProps('email')} />
              </div>
              {formik.touched.email && formik.errors.email && <Message error content={formik.errors.email} />}
            </Form.Field>
            <Form.Field>
              <label htmlFor="password">Contraseña</label>
              <div className="store-input">
                <Icon name="lock" aria-hidden="true" />
                <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" {...formik.getFieldProps('password')} />
              </div>
              {formik.touched.password && formik.errors.password && <Message error content={formik.errors.password} />}
            </Form.Field>
            <Button primary fluid type="submit" loading={formik.isSubmitting} disabled={formik.isSubmitting}>
              Entrar
            </Button>
          </Form>
          <p className="auth-link">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        </section>
      </main>
    </div>
  )
}
