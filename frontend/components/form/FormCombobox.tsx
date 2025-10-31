import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Button } from "../ui/button"
import { FieldError } from "react-hook-form"

type FormComboboxProps = {
  data: Array<{ value: string; label: string }>;
  placeholder?: string;
  onChange: (value: string) => void;
  label: string;
  error?: FieldError
}

function FormCombobox({ data, placeholder, onChange, label, error }: FormComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? data.find((d) => d.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup>
                {data.map((d) => (
                  <CommandItem
                    key={d.value}
                    value={d.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue)
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {d.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === d.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-red-500">{error?.message?.toString()}</span>}
    </div>
  )
}

export default FormCombobox
