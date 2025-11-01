import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  label: string;
  data: Array<{ value: string; label: string }>
  onChange?: (val: string) => void;
  defaultValue?: string;
  placeHolder?: string;
}

function CustomSelect({
  data,
  label,
  defaultValue,
  onChange,
  placeHolder
}: Props) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {data.map(dt => (<SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CustomSelect
