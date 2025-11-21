import NextImage from 'next/image'
import { ImageProps } from 'next/image'

const Image = ({ src, alt, width, height }: ImageProps) => {
  const url = (process.env.NEXT_PUBLIC_STRAPI_URL || '') + src
  return (
    <NextImage 
      src={url}
      alt={alt || ''}
      width={width}
      height={height}/>
  )
}

export default Image