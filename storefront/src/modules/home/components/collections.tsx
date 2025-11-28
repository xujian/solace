import { Collection } from 'types/cms'
import { cn } from '@lib/util/cn'
import Image from '@modules/common/components/cms/image'

export interface CollectionsProps {
  data: Collection[]
}

export default function CollectionsGrid({ data: collections }: CollectionsProps) {
  return (
    <section className='collections'>
      <h2>Collections</h2>
      <div
        className={cn([
          'grid h-[640px] max-h-[640px] grid-rows-3 gap',
          'sm:max-h-[480px] sm:grid-cols-2 sm:grid-rows-2',
          'lg:max-h-[640px]'
        ])}>
        {collections.map((collection, index) => (
          <div
            key={index}
            className={cn([
              'relative',
              {
                'sm:col-start-2 sm:row-start-1 sm:row-end-3': index === 2
              }
            ])}>
            <Image className='h-full w-full object-cover rounded-md' src={collection.image.url} alt={collection.title} />
            <div className="absolute bottom-4 left-4">
              <h2>{collection.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
