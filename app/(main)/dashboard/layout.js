import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const DashboardLayout = () => {
  return (
    <div className="px-5">
        <h1 className='flex items-center justify-center text-6xl font-bold gradient-title mb-5'>Dashboard</h1>

      {/* Dashboard content goes here */}
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='black' />}>
        <DashboardPage />
      </Suspense>
    </div>
  )
}

export default DashboardLayout