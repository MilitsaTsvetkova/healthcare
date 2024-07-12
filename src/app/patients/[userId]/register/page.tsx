import Image from 'next/image'
import RegisterForm from '../../../../components/forms/RegisterForm'
import { getUser } from '../../../../lib/actions/patient.actions'

const page = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId)
  return (
    <div className='flex h-screen mah-h-screen'>
      <section className='remove-scrollbar container'>
        <div className='sub-container max-w-[860px] flex-1 flex-col py-10'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={200}
            height={200}
          />
          <RegisterForm user={user} />

          <p className='copyright py-12'>
            © 2024 All Rights Reserved. CarePulse
          </p>
        </div>
      </section>

      <Image
        src='/assets/images/register-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='side-img max-w-[390px]'
      />
    </div>
  )
}

export default page
