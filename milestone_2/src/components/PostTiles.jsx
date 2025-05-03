export default function PostTiles({ posts, onEditClick, onDeleteClick }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {posts.map((post, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded shadow">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p><strong>Description:</strong> {post.description}</p>
            <p><strong>Duration:</strong> {post.duration}</p>
            <p><strong>Type:</strong> {post.paid}</p>
            {post.salary && <p><strong>Salary:</strong> {post.salary}</p>}
            <p><strong>Skills:</strong> {post.skills}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => onEditClick(index)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => onDeleteClick(index)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  