export function EditCheckBox({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void
}) {
  return (
    <div className='form-control'>
      <label className='label cursor-pointer'>
        <span className='label-text'>Edit</span>
        <input
          type='checkbox'
          defaultChecked={false}
          className='checkbox'
          onChange={(e) => setIsEditing(e.target.checked)}
        />
      </label>
    </div>
  )
}
