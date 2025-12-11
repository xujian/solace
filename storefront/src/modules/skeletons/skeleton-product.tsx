

const SkeletonProduct = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full bg-gray-500 bg-ui-bg-subtle rounded" />
      <div className="flex justify-between text-base-regular mt-2">
        <div className="w-2/5 h-6 bg-gray-500"></div>
        <div className="w-1/5 h-6 bg-gray-500"></div>
      </div>
    </div>
  )
}

export default SkeletonProduct
