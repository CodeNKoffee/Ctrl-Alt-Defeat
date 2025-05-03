import { useState } from 'react';

export default function CompanyCreatePost({ onAddPost }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    paid: 'Paid',
    salary: '',
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPost(form);
    setForm({
      title: '',
      description: '',
      duration: '',
      paid: 'Paid',
      salary: '',
      skills: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" required className="w-full border p-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" required className="w-full border p-2 rounded" />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" required className="w-full border p-2 rounded" />
      <select name="paid" value={form.paid} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>
      <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (Leave empty if N/A)" className="w-full border p-2 rounded" />
      <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills Required" required className="w-full border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Post</button>
    </form>
  );
}
