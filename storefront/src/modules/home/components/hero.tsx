import { BannerData } from 'types/cms'
import Image from '@modules/common/components/cms/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Button } from '@lib/components/ui'

const Hero = ({ data }: { data: BannerData }) => {
  const { title, text, cta, image } = data
  return (
    <div className="hero">
      <div className="hero-image w-full h-[240px] max-h-[320px] sm:h-[240px] md:h-[320px]">
        <Image className='h-full w-full object-cover'
          src={image.url}
          alt={image.alternativeText || ''}
          width={2048}
          height={400}
        />
      </div>
      <div className="p-4 h-[240px] items-start flex flex-col justify-center">
        <h1 className="text-ui-fg-base text-3xl leading-10 font-normal mb-4">{title}</h1>
        <div className="flex items-center gap-4">
          <LocalizedClientLink href={cta.link} className="hover:text-ui-fg-base flex-1 items-start">
            <Button className="bg-white rounded-full text-black">{cta.text}</Button>
          </LocalizedClientLink>
          <p className="text-ui-fg-subtle text-base flex-1 text-gray-300 font-normal">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
