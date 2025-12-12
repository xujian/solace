import { useState } from 'react'
import { Button } from '@lib/components/ui'
import { deleteItem } from '@lib/data/cart'
import { cn } from '@lib/util'
import { RefreshCw as Spinner, X } from 'lucide-react'
import { useCart } from '@lib/context/cart-context'

const DeleteButton = ({
  id,
  children,
  className
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { refreshCart } = useCart()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteItem(id).catch(err => {
      setIsDeleting(false)
    })
    await refreshCart()
    setIsDeleting(false)
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="bg-muted w-6 h-6 cursor-pointer"
      onClick={() => handleDelete(id)}>
      {isDeleting ? <Spinner className="animate-spin" /> : <X />}
    </Button>
  )
}

export default DeleteButton
