export function EditCheckBox({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}) {
  return (
    <div className='form-control w-10'>
      <label className='label cursor-pointer'>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={
            isEditing ? 'btn btn-outline btn-info' : 'btn btn-outline'
          }>
          {isEditing ? 'Save Changes' : 'Edit Page'}
        </button>
      </label>
    </div>
  )
}
