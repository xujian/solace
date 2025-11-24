import { Button, Heading } from '@medusajs/ui'
import { BannerData } from 'types/cms'
import Image from '@modules/common/components/cms/image'

const Hero = ({ data }: { data: BannerData }) => {
  const { title, text, cta, image } = data
  return (
    <div className='hero h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle'>
      <div className='absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6'>
        <span>
          <Image src={image.url}
            alt={image.alternativeText || ''}
            width={1000}
            height={600} />
          <Heading
            level='h1'
            className='text-3xl leading-10 text-ui-fg-base font-normal'
          >
            {title}
          </Heading>
          <p
            className='text-3xl leading-10 text-ui-fg-subtle font-normal'
          >
            {text}
          </p>
        </span>
      </div>
    </div>
  )
}

export default Hero
