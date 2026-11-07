import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Header, Icon, Message } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import { registerApi } from '../api/user.js'
import BrandPanel from '../components/BrandPanel.jsx'

const validationSchema = Yup.object({
  first_name: Yup.string().required('El nombre es obligatorio.'),
  last_name: Yup.string().required('El apellido es obligatorio.'),
  username: Yup.string().required('El usuario es obligatorio.'),
  email: Yup.string().email('Ingresa un correo válido.').required('El correo es obligatorio.'),
  telefono: Yup.string().matches(/^\d{10}$/, 'Ingresa un teléfono de 10 dígitos.').required('El teléfono es obligatorio.'),
  password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').required('La contraseña es obligatoria.'),
  password2: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.').required('Confirma la contraseña.'),
})

export default function Register() {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      first_name: '', last_name: '', username: '', email: '', telefono: '',
      password: '', password2: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await registerApi(values)
        toast.success('Registro exitoso. Ya puedes iniciar sesión.')
        navigate('/login')
      } catch (error) {
        setStatus(error.message)
        toast.error(error.message || 'No se pudo completar el registro.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const fields = [
    ['first_name', 'Nombre', 'text', 'user outline'],
    ['last_name', 'Apellidos', 'text', 'user outline'],
    ['username', 'Nombre de usuario', 'text', 'id badge outline'],
    ['email', 'Correo electrónico', 'email', 'envelope outline'],
    ['telefono', 'Teléfono (10 dígitos)', 'tel', 'phone'],
    ['password', 'Contraseña', 'password', 'lock'],
    ['password2', 'Confirmar contraseña', 'password', 'lock'],
  ]

  return (
    <div className="auth-page">
      <BrandPanel />
      <main className="auth-form-panel">
        <section className="auth-card">
          <Header as="h1">Crear cuenta</Header>
          <p className="muted">Únete y disfruta una experiencia de compra más fácil.</p>
          <Form className="auth-form" onSubmit={formik.handleSubmit}>
            {fields.map(([name, label, type, icon]) => (
              <Form.Field key={name}>
                <label htmlFor={name}>{label}</label>
                <div className="store-input">
                  <Icon name={icon} aria-hidden="true" />
                  <input id={name} type={type} placeholder={label} autoComplete={name === 'password2' ? 'new-password' : name} {...formik.getFieldProps(name)} />
                </div>
                {formik.touched[name] && formik.errors[name] && <Message error content={formik.errors[name]} />}
              </Form.Field>
            ))}
            {formik.status && <Message className="auth-server-error" error content={formik.status} />}
            <Button primary fluid type="submit" loading={formik.isSubmitting} disabled={formik.isSubmitting}>
              Registrarme
            </Button>
          </Form>
          <p className="auth-link">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </section>
      </main>
    </div>
  )
}
