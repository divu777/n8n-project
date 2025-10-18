import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
    const session = getServerSession(authOptions)
    
    if(!session){
        redirect("/login")
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
