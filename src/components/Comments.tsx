import React, { useState } from 'react'

export function CommentDisplay({
  comments,
  id,
}: {
  comments: string[]
  id: string
}) {
  const [commentsVisible, setCommentsVisible] = useState(false)
  const [commentList, setCommentList] = useState(comments)
  const [newComment, setNewComment] = useState('')

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible)
  }

  function addCommentToDB(comments: string[]) {
    console.log(comments)
    fetch('api/updateSingleBuilding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buildingData: { comments, id } }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Error adding comment')
      }
      console.log('Comment added')
    })
  }

  const handleAddComment = (event: React.FormEvent) => {
    event.preventDefault()
    if (newComment.trim()) {
      setCommentList([...commentList, newComment])
      setNewComment('')
      addCommentToDB([...commentList, newComment])
    }
  }

  return (
    <>
      <div className='sticky bottom-1 right-1 z-10'>
        <div className='absolute bottom-1 right-1 z-10'>
          <button
            className='btn btn-circle btn-outline'
            onClick={toggleComments}>
            <CommentIcon />
          </button>
        </div>
        {commentsVisible && (
          <div className='absolute bottom-14 right-4 w-128 bg-gray-400 rounded-box shadow-lg'>
            <div className='p-4'>
              <h3 className='font-bold'>Comments:</h3>
              <ul className='max-h-48 overflow-y-auto'>
                {commentList &&
                  commentList.map((comment, index) => (
                    <li key={index} className='comment-item'>
                      {comment}
                    </li>
                  ))}
              </ul>
              <form
                onSubmit={handleAddComment}
                className='flex items-center mt-2'>
                <input
                  type='text'
                  className='input flex-grow'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder='Your Comment...'
                />
                <button
                  type='submit'
                  className='btn btn-circle btn-outline bg-green-700 ml-2'>
                  <AddCommentButton />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CommentIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'>
      <path
        fillRule='evenodd'
        d='M19,2 C20.5949286,2 21.9034643,3.25157398 21.9948968,4.82401157 L22,5 L22,15 C22,16.5949286 20.748426,17.9034643 19.1759884,17.9948968 L19,18 L15.5,18 L12.8,21.6 C12.611,21.852 12.315,22 12,22 C11.724375,22 11.4632969,21.8866875 11.2757187,21.6895391 L11.2,21.6 L8.5,18 L5,18 C3.40507143,18 2.09653571,16.748426 2.00510323,15.1759884 L2,15 L2,5 C2,3.40507143 3.25157398,2.09653571 4.82401157,2.00510323 L5,2 L19,2 Z M19,4 L5,4 C4.48835714,4 4.06466327,4.38714796 4.00674599,4.88361625 L4,5 L4,15 C4,15.5116429 4.38714796,15.9353367 4.88361625,15.993254 L5,16 L9,16 C9.275625,16 9.53670313,16.1133125 9.72428125,16.3104609 L9.8,16.4 L12,19.333 L14.2,16.4 C14.365375,16.1795 14.6126719,16.038625 14.8829375,16.0068516 L15,16 L19,16 C19.5116429,16 19.9353367,15.612852 19.993254,15.1163837 L20,15 L20,5 C20,4.48835714 19.612852,4.06466327 19.1163837,4.00674599 L19,4 Z M17,11 C17.552,11 18,11.448 18,12 C18,12.5125714 17.6137143,12.9354694 17.1165685,12.9932682 L17,13 L7,13 C6.448,13 6,12.552 6,12 C6,11.4874286 6.38628571,11.0645306 6.88343149,11.0067318 L7,11 L17,11 Z M17,7 C17.552,7 18,7.448 18,8 C18,8.51257143 17.6137143,8.93546939 17.1165685,8.99326822 L17,9 L7,9 C6.448,9 6,8.552 6,8 C6,7.48742857 6.38628571,7.06453061 6.88343149,7.00673178 L7,7 L17,7 Z'
      />
    </svg>
  )
}

function AddCommentButton() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='4'
        d='M5,12H19M12,5V19'
      />
    </svg>
  )
}
