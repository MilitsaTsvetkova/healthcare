import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { Button } from './ui/button'

interface SubmitButtonProps extends PropsWithChildren {
  isLoading: boolean
  className?: string
}

const SubmitButton = ({
  isLoading,
  className,
  children,
}: SubmitButtonProps) => {
  return (
    <Button
      type='submit'
      disabled={isLoading}
      className={className ?? 'shad-primary-btn w-full'}
    >
      {isLoading ? (
        <div className='flex items-center gap-4'>
          <Image
            src='/assets/icons/loader.svg'
            width={24}
            height={24}
            alt='loader'
            className='animate-spin'
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export default SubmitButton
