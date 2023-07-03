import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import "./Layout.scss"

const Layout = () => {
    

  return (
    <div className='layout'> 
    <Nav/>     
    <div className='innerPage'> 
    <Outlet></Outlet>
    </div>
    </div>
  )
}

export default Layout