import React from 'react'

const BrLayout = ({heading,children}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">{heading}</h2>
        {children}
    </div>
  )
}

export default BrLayout