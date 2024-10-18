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
    <div className='flex items-center space-x-2'>
      <span>{name}</span>
      {isEditing ? (
        <input
          title='Editable Field'
          type='text'
          value={value}
          className='input input-bordered w-full max-w-xs'
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div>{value}</div>
      )}
    </div>
  )
}
