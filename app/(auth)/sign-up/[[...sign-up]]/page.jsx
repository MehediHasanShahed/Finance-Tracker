'use client'
import { SignUp } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  )
}

export default Page