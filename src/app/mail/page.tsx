'use client'

import dynamic from 'next/dynamic'
import React from 'react'
const Mail = dynamic(() => {
  return import('./mail')
}, {
  ssr: false
})

const MailDashboard = () => {
  return (
    <Mail 
      defaultLayout={[20, 32, 48]}
      navCollapsedSize={50}
      defaultColapsed={false}
    />
  )
}

export default MailDashboard