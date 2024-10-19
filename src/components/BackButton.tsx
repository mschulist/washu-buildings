import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  function goBack() {
    router.back()
  }

  return (
    <div className='absolute top-10 left-10'>
      <button className='btn' onClick={goBack}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='h-6 w-6'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M7 16l-4-4m0 0l4-4m-4 4h18'></path>
        </svg>
        Back
      </button>
    </div>
  )
}
