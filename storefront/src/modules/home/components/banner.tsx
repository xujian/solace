import { BannerData } from 'types/cms'
import { Button } from '@lib/components/ui'
import Image from '@modules/common/components/cms/image'

export default function Banner({ data }: { data: BannerData }) {
  const { title, text, cta, image } = data
  return (
    <section className="banner h-[75vh] w-full">
      <div className="cover-image">
        <Image src={image.url} alt={image.alternativeText || ''} width={1000} height={600} />
      </div>
      <div className="banner-content p-6">
        <h2>{title}</h2>
        <div className="flex items-center gap-4">
          <div className='flex-1 items-start'>
            <Button className='rounded-full'>{cta.text}</Button>
          </div>
          <div className='flex-1 items-start'>{text}</div>
        </div>
      </div>
    </section>
  )
}
