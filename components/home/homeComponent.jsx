import { randomText } from "@/data/data"
import Image from "next/image"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"  // Spinner icon

const HomeComponent = () => {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full text-justify">
          
          {/* Image with Loader */}
          <div className="relative md:float-left md:mr-4 mb-26 md:mb-4 max-h-[324px]">
            {loading && (
              <div className="absolute inset-0 flex h-full items-center justify-center bg-gray-100 rounded-lg shadow-lg">
                <LoaderCircle className="animate-spin h-10 w-10 text-gray-500" />
              </div>
            )}
            <Image
              src="/assets/aeroplaneImage2.jpg"
              alt="Hero Image Description"
              width={486}
              height={324}
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

export default HomeComponent
