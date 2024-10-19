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
        <div className='col-span-2'>
          <input
            title='Editable Field'
            type='text'
            value={value}
            className='input input-bordered w-full max-w-xs'
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div className='col-span-2'>
          <label className='label'>{value}</label>
        </div>
      )}
    </>
  )
}
