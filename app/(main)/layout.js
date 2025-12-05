import React from 'react'

const Mainlayout = ({children}) => {
  return (
    <div className='container mx-auto my-32 px-4 md:px-8'>{children}</div>
  )
}

export default Mainlayout