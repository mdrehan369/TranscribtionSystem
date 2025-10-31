import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { FieldError } from "react-hook-form";

type Props = {
  defaultValue: string;
  values: string[];
  label: string;
  onChange: (val: string) => void;
  error?: FieldError
}

function FormRadioGroup({ defaultValue, values, onChange, error, label }: Props) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <RadioGroup defaultValue={defaultValue} onValueChange={(val) => onChange(val)} className="flex items-center justify-start mt-2">
        {values.map(val => (<div key={val} className="flex items-center gap-3">
          <RadioGroupItem value={val} id={val} />
          <Label htmlFor={val}>{val}</Label>
        </div>))}
        {error && <span className="text-xs text-red-500">{error?.message?.toString()}</span>}
      </RadioGroup>
    </div>
  )
}

export default FormRadioGroup
