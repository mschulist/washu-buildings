export function FloatingBox() {
  return (
    <div className='floating-box'>
      <ul className='menu bg-base-200 rounded-box w-56'>
        <li>
          <details open>
            <summary>Features</summary>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Filter 1</span>
                <input type='checkbox' checked={false} className='checkbox' />
              </label>
            </div>
          </details>
          <details open>
            <summary>Building Type</summary>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Filter 1</span>
                <input type='checkbox' checked={false} className='checkbox' />
              </label>
            </div>
          </details>
        </li>
      </ul>
    </div>
  )
}
