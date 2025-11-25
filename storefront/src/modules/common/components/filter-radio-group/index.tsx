import { MoreHorizontal } from "lucide-react"
import { RadioGroup, RadioGroupItem, Label } from "@lib/components/ui"
import { cn } from "@lib/util"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <span className="txt-compact-small-plus text-ui-fg-muted">{title}</span>
      <RadioGroup data-testid={dataTestId} value={value} onValueChange={handleChange}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={cn("flex gap-x-2 items-center", {
              "ml-[-23px]": i.value === value,
            })}
          >
            {i.value === value && <MoreHorizontal />}
            <RadioGroupItem
              value={i.value}
              className="hidden peer"
              id={i.value}
            />
            <Label
              htmlFor={i.value}
              className={cn(
                "!txt-compact-small transform-none! text-ui-fg-subtle hover:cursor-pointer",
                {
                  "text-ui-fg-base": i.value === value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
