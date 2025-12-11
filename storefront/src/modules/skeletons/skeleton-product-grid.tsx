import repeat from '@lib/util/repeat'
import SkeletonProductPreview from '@modules/skeletons/skeleton-product'

const SkeletonProductGrid = ({
  number = 8
}: {
  number?: number
}) => {
  return (
    <ul
      className="grid-auto"
      data-testid="products-list-loader">
      {repeat(number).map(index => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
