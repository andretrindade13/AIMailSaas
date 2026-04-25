'use client'

import React from 'react'
import Mail from './mail'

const MailDashboard = () => {
  return (
    <Mail 
      defaultLayout={[20, 32, 48]}
      navColapsedSize={50}
      defaultColapsed={false}
    />
  )
}

export default MailDashboard