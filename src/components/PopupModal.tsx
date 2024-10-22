import { Building } from './Building'

export function PopupModal({
  selectedBuilding,
  setSelectedBuilding,
  validUser,
}: {
  selectedBuilding: string | null
  setSelectedBuilding: (id: string | null) => void
  validUser: boolean
}) {
  return (
    <dialog
      id='modal'
      className='modal'
      onClose={() => setSelectedBuilding(null)}>
      <div className='modal-box md:max-w-[75vw] max-w-[90vw] p-1 md:p-6'>
        {selectedBuilding && (
          <Building id={selectedBuilding} validUser={validUser} />
        )}
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button />
      </form>
    </dialog>
  )
}
