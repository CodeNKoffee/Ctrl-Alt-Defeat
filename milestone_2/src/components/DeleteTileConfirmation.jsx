import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import ActionButton from "./shared/ActionButton";

export default function DeleteTileConfirmation({ onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-5 w-full max-w-sm border border-[var(--metallica-blue-200)]">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-[var(--metallica-blue-800)]">Are you sure you want to delete this post?</p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex justify-center gap-4 pt-2">
            <ActionButton
              buttonType="reject"
              onClick={onConfirm}
              icon={faTrash}
              text="Confirm Delete"
            />
            <ActionButton
              buttonType="accept"
              onClick={onCancel}
              icon={faTimes}
              text="Cancel"
            />
          </div>
        </div>
      </div> 
    );
  }
