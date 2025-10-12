import { NavLink } from 'react-router-dom'

const Link = ({to, children}) => (
  <NavLink to={to} className={({isActive})=> 'menu-link' + (isActive ? ' active' : '') }>
    {({isActive})=>(
      <span className={isActive ? 'active' : ''}>{children}</span>
    )}
  </NavLink>
)

export default function Sidebar(){
  return (
    <nav className="menu">
      <NavLink to="/dashboard" className={({isActive})=> isActive ? 'active' : ''}>📊 Dashboard</NavLink>
      <NavLink to="/productos" className={({isActive})=> isActive ? 'active' : ''}>📦 Productos</NavLink>
      <NavLink to="/ventas" className={({isActive})=> isActive ? 'active' : ''}>🧾 Ventas</NavLink>
      <NavLink to="/clientes" className={({isActive})=> isActive ? 'active' : ''}>👥 Clientes</NavLink>
    </nav>
  )
}
