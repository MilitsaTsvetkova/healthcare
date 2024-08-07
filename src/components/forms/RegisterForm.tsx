'use client'

import { Form, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '../../constants'
import { registerPatient } from '../../lib/actions/patient.actions'
import { PatientFormValidation } from '../../lib/validation'
import CustomFormField from '../CustomFormField'
import FileUploader from '../FileUploader'
import SubmitButton from '../SubmitButton'
import { SelectItem } from '../ui/select'
import { FormFieldType } from './PatientForm'

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      email: '',
      phone: '',
    },
  })

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true)
    let formData
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })
      formData = new FormData()
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].name)
    }
    try {
      const patientData = {
        ...values,
        userid: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      const patient = await registerPatient(patientData)
      if (patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='space-y-4'>
          <h1 className='header'>Welcome</h1>
          <p className='text-dark-700'>Let us know more about yourself</p>
        </section>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal Information </h2>
          </div>
          <CustomFormField
            control={form.control}
            name='name'
            label='Full name'
            fieldType={FormFieldType.INPUT}
            placeholder='John Doe'
            iconAlt='user'
            iconSrc='/assets/icons/user.svg'
          />

          <div className='flex flex-col gap-6 xl:flex-row'>
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
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='birthDate'
              label='Date of Birth'
              fieldType={FormFieldType.DATE_PICKER}
              iconAlt='birthDate'
              iconSrc='/assets/icons/appointments.svg'
            />
            <CustomFormField
              control={form.control}
              name='gender'
              label='Gender'
              fieldType={FormFieldType.SKELETON}
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    className='flex h-11 gap-6 xl:justify-between'
                    onValueChange={field.onChange}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className='radio-group'>
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className='cursor-pointer'>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='address'
              label='Address'
              fieldType={FormFieldType.INPUT}
              placeholder='14th Street 123, New York, NY 10001'
            />
            <CustomFormField
              control={form.control}
              name='occupation'
              label='Occupation'
              fieldType={FormFieldType.INPUT}
              placeholder='Software Engineer'
            />
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='emergencyContactName'
              label='Emergency contact name'
              fieldType={FormFieldType.INPUT}
              placeholder="Guardian's name"
            />
            <CustomFormField
              control={form.control}
              name='emergencyContactNumber'
              label='Emergency contact number'
              fieldType={FormFieldType.PHONE_INPUT}
              placeholder='(555) 123-4567'
            />
          </div>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Medical Information</h2>
          </div>

          <CustomFormField
            control={form.control}
            name='primaryPhysician'
            label='Primary Physician'
            fieldType={FormFieldType.SELECT}
            placeholder='Select a physician'
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className='flex cursor-pointer items-center gap-2'>
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={32}
                    height={32}
                    className='rounded-full border border-dark-500'
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='insuranceProvider'
              label='Insurance provider'
              fieldType={FormFieldType.INPUT}
              placeholder='ex: BlueCross'
            />
            <CustomFormField
              control={form.control}
              name='insurancePolicyNumber'
              label='Insurance policy number'
              fieldType={FormFieldType.INPUT}
              placeholder='ex: ABC1234567'
            />
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='allergies'
              label='Allergies (if any)'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Peanuts, Penicillin, Pollen'
            />
            <CustomFormField
              control={form.control}
              name='currentMedications'
              label='Current medications'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Ibuprofen 200mg, Levothyroxine 50mcg'
            />
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='allergies'
              label='Allergies (if any)'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Peanuts, Penicillin, Pollen'
            />
            <CustomFormField
              control={form.control}
              name='currentMedications'
              label='Current medications'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Ibuprofen 200mg, Levothyroxine 50mcg'
            />
          </div>
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              control={form.control}
              name='familyMedicalHistory'
              label='Family medical history (if relevant)'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Mother had breast cancer, Father had diabetes'
            />
            <CustomFormField
              control={form.control}
              name='pastMedicalHistory'
              label='Past medical history'
              fieldType={FormFieldType.TEXTAREA}
              placeholder='ex: Asthma diagnosis in childhood'
            />
          </div>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Identification and Verification</h2>
          </div>

          <CustomFormField
            control={form.control}
            name='identificationType'
            label='IdentificationType'
            fieldType={FormFieldType.SELECT}
            placeholder='Select identification type'
          >
            {IdentificationTypes.map((identification) => (
              <SelectItem key={identification} value={identification}>
                <div className='flex cursor-pointer items-center gap-2'>
                  <p>{identification}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            name='identificationNumber'
            label='Identification Number'
            fieldType={FormFieldType.INPUT}
            placeholder='ex: 1234567'
          />
          <CustomFormField
            control={form.control}
            name='identificationDocument'
            label='Scanned Copy of Identification Document'
            fieldType={FormFieldType.SKELETON}
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='treatmentConsent'
            label='I consent to receive treatment for my health condition.'
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='disclosureConsent'
            label='I consent to the use and disclosure of my health
            information for treatment purposes.'
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='privacyConsent'
            label='I acknowledge that I have reviewed and agree to the
            privacy policy'
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and continue</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
