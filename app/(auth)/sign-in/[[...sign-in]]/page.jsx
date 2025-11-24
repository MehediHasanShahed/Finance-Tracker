'use client'
import { SignIn } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  )
}

export default Page