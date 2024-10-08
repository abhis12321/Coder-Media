import { faComment, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function BlogFooter({ blog, setOption, handleLikes }) {
  return (
    <div className='w-[100%] flex items-center justify-around'>
      <div className={"w-1/3 py-[11px] rounded-sm text-white hover:bg-gray-600/15 dark:hover:bg-white/10 cursor-pointer flex gap-4 items-center justify-center font-semibold group"} onClick={handleLikes} >
        <FontAwesomeIcon size='sm' icon={faThumbsUp} className={`h-5 group-hover:drop-shadow-none ${blog.liked ? "text-blue-600" : "group-hover:text-blue-700/80 drop-shadow-[0_0_1px_black]"}`}/>
        <div className={`${blog.liked ? "text-blue-600" : "text-gray-500/90 group-hover:text-blue-700/90"}`}>Like</div>
      </div>
      <div className="w-1/3 py-[11px] rounded-sm text-white hover:bg-gray-600/15 dark:hover:bg-white/10 cursor-pointer flex gap-4 items-center justify-center font-semibold group" onClick={() => setOption(1)} >
        <FontAwesomeIcon size='sm' icon={faComment} className='h-5 group-hover:drop-shadow-none drop-shadow-[0_0_1px_black] group-hover:text-blue-700/80'/>
        <div className="text-gray-500/90 group-hover:text-blue-700/90">Comment</div>
      </div>
      <div className="w-1/3 py-[11px] rounded-sm text-white hover:bg-gray-600/15 dark:hover:bg-white/10 cursor-pointer flex gap-4 items-center justify-center font-semibold group" onClick={() => setOption(2)} >
        <FontAwesomeIcon size='sm' icon={faShare} className='h-5 group-hover:drop-shadow-none drop-shadow-[0_0_1px_black] group-hover:text-blue-700/80'/>
        <div className="text-gray-500/90 group-hover:text-blue-700/90">Share</div>
      </div>
    </div>
  )
}
