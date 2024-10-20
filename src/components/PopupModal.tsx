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
      <div className='modal-box max-w-[75vw]'>
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
