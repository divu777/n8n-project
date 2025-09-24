'use client'
import axios from 'axios'
import React from 'react'

const page = () => {
    const mockcall = async()=>{
          const { data } = await axios.get("http://localhost:3000/api/workflows")
          console.log(JSON.stringify(data)+"+++++++")
    }


    mockcall()

  return (
    <div>
      hello
    </div>
  )
}

export default page
