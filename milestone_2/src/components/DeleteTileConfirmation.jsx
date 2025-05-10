export default function DeleteTileConfirmation({ onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg text-center space-y-4 w-full max-w-sm">
          <p className="text-lg">Are you sure you want to delete this post?</p>
          <div className="space-x-2">
            <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">Confirm Delete</button>
            <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div> 
    );
  }
  