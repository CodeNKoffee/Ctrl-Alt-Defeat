import { useState, useEffect } from 'react';

export default function TileEdit({ post, onSave, onCancel }) {
  const [editForm, setEditForm] = useState(post);

  useEffect(() => {
    setEditForm(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editForm);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg space-y-3 w-full max-w-md">
        <input name="title" value={editForm.title} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" value={editForm.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="duration" value={editForm.duration} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="paid" value={editForm.paid} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <input name="salary" value={editForm.salary} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="skills" value={editForm.skills} onChange={handleChange} className="w-full border p-2 rounded" />
        <div className="space-x-2 mt-4">
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
