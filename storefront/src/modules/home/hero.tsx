import { BannerData } from 'types/cms'
import Image from '@modules/common/components/cms/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Button, FlipWords } from '@lib/components/ui'

const RenderFlipWords = ({ line }: { line: string }) => {
  const parts = line.split(/(\[.*?\])/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          const words = part
            .slice(1, -1)
            .split(',')
            .map((w) => w.trim())
          return <FlipWords key={index} words={words} />
        }
        return part.trim()
      })}
    </>
  )
}

// to support title effects
const RichTitle = ({ title }: { title: string }) => {
  // split title into lines by '\n'
  const lines = title.split('\\n')
  return (
    <h2 className="text-4xl font-bold">
      {lines.map((line, index) => (
        <span key={index} className="inline-block">
          <RenderFlipWords line={line} />
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </h2>
  )
}

const Hero = ({ data }: { data: BannerData }) => {
  
  const { title, text, cta, image } = data
  return (
    <section className="hero full-bleed">
      <div className="cover-image">
        <Image src={image.url} alt={image.alternativeText || ''} width={2048} height={400} />
      </div>
      <div className="p-4 items-start flex flex-col justify-center">
        <RichTitle title={title} />
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
