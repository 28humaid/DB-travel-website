"use client"
import { randomText } from "@/data/data"
import { LoaderCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const AboutComponent = () => {
  const [loading, setLoading] = useState(true)
  return (
    <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
            <div className="w-full text-justify">
              
              {/* Image with Loader */}
              <div className="relative md:float-right md:ml-4 mb-26 md:mb-4 max-h-[376px]">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg">
                    <LoaderCircle className="animate-spin h-10 w-10 text-gray-500" />
                  </div>
                )}
                <Image
                  src="/assets/aeroplaneImage3.jpg"
                  alt="Hero Image Description"
                  width={482}
                  height={366}
                  className="object-contain rounded-lg shadow-sm w-full md:w-auto"
                  onLoadingComplete={() => setLoading(false)}
                />
              </div>
    
              {/* Text Section */}
              <div className="sm:mt-44 md:mt-0">
                <p className="text-gray-700">{randomText.text}</p>
              </div>
            </div>
          </div>
        </>
  )
}

export default AboutComponent