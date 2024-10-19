export function EditableField({
  name,
  value,
  onChange,
  isEditing,
}: {
  name: string
  value: string
  onChange: (value: string) => void
  isEditing: boolean
}) {
  return (
    <>
      <div className='col-span-1'>
        <label className='label'>{name}</label>
      </div>
      {isEditing ? (
        <div className='col-span-2 p-1'>
          <textarea
            title='editable field'
            className='textarea textarea-bordered w-full'
            value={value}
            onChange={(e) => onChange(e.target.value)}></textarea>
        </div>
      ) : (
        <div className='col-span-2'>
          <label className='label'>{value}</label>
        </div>
      )}
    </>
  )
}
