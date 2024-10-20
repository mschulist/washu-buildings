export function EditableField({
  name,
  value,
  checked,
  onCheckChange,
  onChange,
  isEditing,
}: {
  name: string
  value: string
  checked: number
  onCheckChange: (value: number) => void
  onChange: (value: string) => void
  isEditing: boolean
}) {
  const checkedValue = Boolean(checked)
  return (
    <>
      <div className='col-span-1 items-center'>
        <label className='label'>{name}</label>
      </div>
      <input
        title='hasField'
        type='checkbox'
        checked={checkedValue}
        className='checkbox'
        onChange={(e) => onCheckChange(e.target.checked ? 1 : 0)}
      />
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
