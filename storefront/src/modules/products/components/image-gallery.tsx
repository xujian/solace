import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex flex-col items-start gap">
      {images.map((image, index) => {
        return (
          <div
            key={image.id}
            className="aspect-29/34 w-full overflow-hidden"
            id={image.id}>
            {!!image.url && (
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className="w-full h-full rounded object-cover"
                alt={`Product image ${index + 1}`}
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                width={100}
                height={100}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ImageGallery
