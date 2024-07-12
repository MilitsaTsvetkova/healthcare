'use client'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { E164Number } from 'libphonenumber-js/core'
import Image from 'next/image'
import { PropsWithChildren, ReactNode } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Control } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { FormFieldType } from './forms/PatientForm'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

interface CustomProps extends PropsWithChildren {
  control: Control<any>
  name: string
  label: string
  fieldType: FormFieldType
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  renderSkeleton?: (field: any) => ReactNode
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    iconSrc,
    placeholder,
    iconAlt,
    showTimeSelect,
    dateFormat,
    children,
    disabled,
    name,
    label,
    renderSkeleton,
  } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || 'icon'}
              height={24}
              width={24}
              className='ml-2'
            />
          )}
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className='shad-input border-0'
            />
          </FormControl>
        </div>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            placeholder={placeholder}
            defaultCountry='US'
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className='input-phone'
          />
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          <Image
            src='/assets/icons/calendar.svg'
            height={24}
            width={24}
            alt='calendar'
            className='ml-2'
          />
          <FormControl>
            <ReactDatePicker
              selected={field.value}
              onChange={(date: Date | null) =>
                field.onChange(date || undefined)
              }
              showTimeSelect={showTimeSelect ?? false}
              dateFormat={dateFormat ?? 'MM/dd/yyyy'}
              timeInputLabel='Time:'
              wrapperClassName='date-picker'
            />
          </FormControl>
        </div>
      )
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            {...field}
            {...props}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue
                  placeholder={placeholder}
                  className='shad-select-value'
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='shad-select-content'>
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            {...field}
            placeholder={placeholder}
            className='shad-textArea'
            disabled={disabled}
          />
        </FormControl>
      )
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={name} className='checkbox-label'>
              {label}
            </label>
          </div>
        </FormControl>
      )
    default:
      break
  }
}

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, fieldType } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className='shad-input-label'>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
