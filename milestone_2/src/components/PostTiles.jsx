export default function PostTiles({ posts, onEditClick, onDeleteClick }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', // or 100%, or any set height
      }}>
        {posts.map((post, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded shadow" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', // or 100%, or any set height
            border: '1px solid gray'
          }}>
            <h3 className="text-lg font-bold" style={{ overflowWrap: 'break-word' }}>{post.title}</h3>
            <p style={{ overflowWrap: 'break-word' }}><strong>Description:</strong> {post.description}</p>
            <p style={{ overflowWrap: 'break-word' }}><strong>Duration:</strong> {post.duration}</p>
            <p style={{ overflowWrap: 'break-word' }}><strong>Type:</strong> {post.paid}</p>
            {post.salary ? <p style={{ overflowWrap: 'break-word' }}><strong>Salary:</strong> {post.salary}</p> : <p><strong>Salary:</strong> N/A</p>}
            <p style={{ overflowWrap: 'break-word' }}><strong>Skills:</strong> {post.skills}</p>
            <div className="mt-2 space-x-2" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto'}}>
              <button onClick={() => onEditClick(index)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => onDeleteClick(index)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  