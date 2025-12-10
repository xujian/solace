import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@lib/components/ui/select'
import { Filters } from 'types/global'
import Sort from './sort'

export default function ProductFilters({
  data
}: {
  data: Filters
}) {
  return (
    <section className="product-filters flex gap-4">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>(Category)</SelectLabel>
            {data.category.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Collection" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>(Collection)</SelectLabel>
            {data.collection.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Material" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>(Material)</SelectLabel>
            {data.material.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Sort />
    </section>
  )
}
