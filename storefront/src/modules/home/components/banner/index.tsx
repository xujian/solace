import { BannerData } from 'types/cms'
import Image from '@modules/common/components/cms/image'
import { Button } from '@lib/components/ui/button'


export default function Banner({ data }: { data: BannerData }) {
  const { title, text, cta, image } = data
  return (
    <div className='banner w-full h-[75vh]'>
      <Image src={image.url}
        alt={image.alternativeText || ''}
        width={1000}
        height={600} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Button variant="default">{cta.text}</Button>
    </div>
  )
}