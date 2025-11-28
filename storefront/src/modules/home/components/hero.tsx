import { BannerData } from 'types/cms'
import Image from '@modules/common/components/cms/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Button } from '@lib/components/ui'

const Hero = ({ data }: { data: BannerData }) => {
  const { title, text, cta, image } = data
  return (
    <section className="hero full-bleed">
      <div className="cover-image">
        <Image src={image.url} alt={image.alternativeText || ''} width={2048} height={400} />
      </div>
      <div className="p-4 items-start flex flex-col justify-center">
        <h2 className="">{title}</h2>
        <div className="flex items-center gap-4">
          <LocalizedClientLink href={cta.link} className="hover:text-ui-fg-base flex-1 items-start">
            <Button className='rounded-full'>{cta.text}</Button>
          </LocalizedClientLink>
          <p className="text-ui-fg-subtle text-base flex-1 text-gray-300 font-normal">{text}</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
