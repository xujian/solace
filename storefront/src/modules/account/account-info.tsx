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

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = 'An error occurred, please try again',
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
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
    <div className="text-small-regular" data-testid={dataTestid}>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-ui-fg-base uppercase">{label}</span>
          <div className="flex flex-1 basis-0 items-center justify-end gap-x-4">
            {typeof currentInfo === 'string' ? (
              <span className="font-semibold" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className="min-h-[25px] w-[100px] py-1"
            onClick={handleToggle}
            type={state ? 'reset' : 'button'}
            data-testid="edit-button"
            data-active={state}>
            {state ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Success state */}
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
          <Badge className="my-4 p-2" variant="secondary">
            <span>{label} updated succesfully</span>
          </Badge>
        </CollapsibleContent>
      </Collapsible>

      {/* Error state  */}
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

      <Collapsible open={state}>
        <CollapsibleContent
          className={cn(
            'overflow-visible transition-[max-height,opacity] duration-300 ease-in-out',
            {
              'max-h-[1000px] opacity-100': state,
              'max-h-0 opacity-0': !state
            }
          )}>
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="mt-2 flex items-center justify-end">
              <Button
                isLoading={pending}
                className="small:max-w-[140px] w-full"
                type="submit"
                data-testid="save-button">
                Save changes
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AccountInfo
