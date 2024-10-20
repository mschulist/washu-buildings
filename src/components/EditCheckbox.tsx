export function EditCheckBox({
  isEditing,
  setIsEditing,
  validUser,
}: {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  validUser: boolean
}) {
  return (
    <div className='form-control w-10'>
      <label className='label cursor-pointer'>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={!validUser}
          className={
            isEditing ? 'btn btn-outline btn-info' : 'btn btn-outline'
          }>
          {isEditing ? 'Save Changes' : 'Edit Page'}
        </button>
      </label>
    </div>
  )
}
