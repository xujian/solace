import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent
} from '@lib/components/ui'
import useToggleState from '@lib/hooks/use-toggle-state'
import { cn } from '@lib/util'

type AccountFromContainerProps = {
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountFormContainer = ({
  isSuccess,
  isError,
  clearState,
  errorMessage = 'An error occurred, please try again',
  children,
  'data-testid': dataTestid
}: AccountFromContainerProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()
  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }
  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])
  return (
    <div className="account-form-container flex flex-col gap-4 p-4" data-testid={dataTestid}>
      {children}
      <Button
        isLoading={pending}
        className="w-full"
        type="submit"
        data-testid="save-button">
        Save
      </Button>
      <Collapsible open={isSuccess}>
        <CollapsibleContent
          className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
            {
              'max-h-[1000px] opacity-100': isSuccess,
              'max-h-0 opacity-0': !isSuccess
            }
          )}
          data-testid="success-message">
        </CollapsibleContent>
      </Collapsible>
      <Collapsible open={isError}>
        <CollapsibleContent
          className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
            {
              'max-h-[1000px] opacity-100': isError,
              'max-h-0 opacity-0': !isError
            }
          )}
          data-testid="error-message">
          <Badge className="my-4 p-2" variant="destructive">
            <span>{errorMessage}</span>
          </Badge>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AccountFormContainer
