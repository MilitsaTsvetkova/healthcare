'use client'

import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createUser } from '../../lib/actions/patient.actions'
import { UserFormValidation } from '../../lib/validation'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)
    try {
      const userData = { name, email, phone }
      const user = await createUser(userData)
      if (user) router.push(`/patients/${user.$id}/register`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        <section className='mb-12 space-y-4'>
          <h1 className='header'>Hi there</h1>
          <p className='text-dark-700'>Schedule your first appointment.</p>
        </section>

        <CustomFormField
          control={form.control}
          name='name'
          label='Full name'
          fieldType={FormFieldType.INPUT}
          placeholder='John Doe'
          iconAlt='user'
          iconSrc='/assets/icons/user.svg'
        />
        <CustomFormField
          control={form.control}
          name='email'
          label='Email'
          fieldType={FormFieldType.INPUT}
          placeholder='johndoe@gmail.com'
          iconAlt='email'
          iconSrc='/assets/icons/email.svg'
        />
        <CustomFormField
          control={form.control}
          name='phone'
          label='Phone Number'
          fieldType={FormFieldType.PHONE_INPUT}
          placeholder='(555) 123-4567'
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
