import { useState, useEffect } from 'react';

export default function TileEdit({ post, onSave, onCancel }) {
  const [editForm, setEditForm] = useState(post);
  const [paidValidation, setPaid] = useState(true)

  useEffect(() => {
    setEditForm(post);
  }, [post]);

  useEffect(() => {
    if(editForm.paid === 'Paid'){
      setPaid(true)
    }else{
      setPaid(false)
      setEditForm((prev) => ({...prev, salary: 'N/A'}))
    }
  }, [editForm.paid])

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
        <form onSubmit={handleSave}>
          <p><strong>Title</strong></p>
          <input name="title" value={editForm.title} onChange={handleChange} className="w-full border p-2 rounded" required />
          <p><strong>Description</strong></p>
          <textarea name="description" value={editForm.description} onChange={handleChange} className="w-full border p-2 rounded" required/>
          <p><strong>Duration</strong></p>
          <input name="duration" value={editForm.duration} onChange={handleChange} className="w-full border p-2 rounded" required/>
          <p><strong>Paid/Unpaid</strong></p>
          <select name="paid" value={editForm.paid} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
          {paidValidation ? 
          <div>
            <p><strong>Salary</strong></p>
            <input name="salary" value={editForm.salary} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </div> : null}
          <p><strong>Skills Required</strong></p>
          <input name="skills" value={editForm.skills} onChange={handleChange} className="w-full border p-2 rounded" required/>
          <div className="space-x-2 mt-4" style={{ display: 'flex', justifyContent: 'space-between'}}>
            <button type='submit' className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
