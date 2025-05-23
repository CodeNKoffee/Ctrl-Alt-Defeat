export default function DeleteTileConfirmation({ type, onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4 w-full max-w-sm">
          <p className="text-lg">Are you sure you want to delete this {type}?</p>
          <div className="w-full flex items-center space-x-2">
            <button onClick={onCancel} className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-full">Cancel</button>
            <button onClick={onConfirm} className="w-1/2 bg-red-600 text-white px-4 py-2 rounded-full">Confirm Delete</button>
          </div>
        </div>
      </div> 
    );
  }
