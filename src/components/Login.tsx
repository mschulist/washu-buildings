'use client'
import { useState } from 'react'
import { signInWithEmail } from '@/db_utils/loginActions'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState(' ')

  const validateEmail = (email: string) => {
    const wustlEmailRegex = /^[a-zA-Z0-9._%+-]+@wustl\.edu$/
    return wustlEmailRegex.test(email)
  }

  const handleEmailChange = (e: { target: { value: string } }) => {
    const inputEmail = e.target.value
    setEmail(inputEmail)

    // Check email against the regex
    if (!validateEmail(inputEmail)) {
      setErrorMessage('Email must end with @wustl.edu')
    } else {
      setErrorMessage('')
    }
  }

  async function handleLoginClick(formData: FormData) {
    const ok = await signInWithEmail(formData)
    if (!ok) {
      setErrorMessage('Error logging in')
    } else {
      setErrorMessage('')
      const modal = document.getElementById('loginButton') as HTMLDialogElement
      if (modal) {
        modal.close()
      }
    }
  }

  return (
    <form className='flex flex-col justify-center items-center'>
      <label htmlFor='email'>Email:</label>
      <input
        id='email'
        name='email'
        type='email'
        className='input input-bordered w-full max-w-xs m-4'
        required
        value={email}
        onChange={handleEmailChange}
      />
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <button
        formAction={handleLoginClick}
        className='btn btn-secondary m-4'
        disabled={errorMessage !== ''}>
        Get Magic Link!
      </button>
    </form>
  )
}

export function LoginButton() {
  return (
    <div className='absolute top-4 right-52 z-10'>
      <button
        className='btn'
        onClick={() => {
          const modal = document.getElementById(
            'loginButton',
          ) as HTMLDialogElement

          if (modal) {
            modal.showModal()
          } else {
            console.error('Could not find modal')
          }
        }}>
        Login!
      </button>
      <dialog id='loginButton' className='modal'>
        <div className='modal-box max-w-72'>
          <LoginPage />
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn'>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
