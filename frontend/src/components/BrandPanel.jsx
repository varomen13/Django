import { Icon } from 'semantic-ui-react'

const benefits = [
  ['shipping fast', 'Envío rápido'],
  ['lock', 'Pago seguro'],
  ['tag', 'Ofertas exclusivas'],
]

export default function BrandPanel() {
  return (
    <aside className="brand-panel">
      <div className="brand-content">
        <div className="brand-logo">
          <span className="brand-logo-icon"><Icon name="shopping cart" /></span>
          <span>Tienda Online</span>
        </div>
        <div className="brand-copy">
          <span className="brand-eyebrow">Todo lo que buscas, en un solo lugar</span>
          <h2>Una mejor forma de comprar.</h2>
          <p>Descubre productos que te encantan y disfruta una experiencia de compra sencilla y segura.</p>
        </div>
        <ul className="brand-benefits">
          {benefits.map(([icon, text]) => (
            <li key={text}><Icon name={icon} />{text}</li>
          ))}
        </ul>
        <div className="brand-decoration brand-decoration-one" />
        <div className="brand-decoration brand-decoration-two" />
      </div>
    </aside>
  )
}
