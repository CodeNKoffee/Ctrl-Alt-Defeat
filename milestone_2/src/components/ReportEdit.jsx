import { useState, useEffect } from 'react';

export default function TileEdit({ report, onSave, onCancel }) {
  const [editReport, setEditReport] = useState(report);

  useEffect(() => {
    setEditReport(report);
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editReport);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg space-y-3 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <label className="block text-sm font-medium text-gray-700">Internship Title:</label>
        <input required name="internshipTitle" value={editReport.internshipTitle} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Company/Organization Name:</label>
        <input required name="companyOrgName" value={editReport.companyOrgName} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Introduction:</label>
        <textarea required name="introduction" value={editReport.introduction} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Company/Organization Description:</label>
        <textarea required name="companyDesc" value={editReport.companyDesc} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Internship Performed Tasks:</label>
        <textarea required name="tasks" value={editReport.tasks} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Internship Evaluation:</label>
        <p className="text-sm text-gray-500">
            What skills do you think that you have gained from the internship? Did the internship meet your expectations? 
            If not, please explain why? How do you think the internship will influence your future career plans? 
            How do you think the internship activities that you carried out are correlated with your studies? 
            Which of the academic courses that you have taken in GUC were the most related to your internship?
        </p>
        <textarea required name="evaluation" value={editReport.evaluation} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Conclusion:</label>
        <textarea required name="conclusion" value={editReport.conclusion} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">References:</label>
        <textarea required name="references" value={editReport.references} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="block text-sm font-medium text-gray-700">Appendencies:</label>
        <textarea required name="appendencies" value={editReport.appendencies} onChange={handleChange} className="w-full border p-2 rounded" />

        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">Please rate your satisfaction with the internship experience</label>
            <div className="flex items-center">
                <input onChange={handleChange} type="radio" name="satisfaction" value="Very satisfied" required className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Very satisfied</label>
            </div>
            <div className="flex items-center">
                <input onChange={handleChange} type="radio" name="satisfaction" value="Somehow satisfied" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Somehow satisfied</label>
            </div>
            <div className="flex items-center">
                <input onChange={handleChange} type="radio" name="satisfaction" value="Neutral" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Neutral</label>
            </div>
            <div className="flex items-center">
                <input onChange={handleChange} type="radio" name="satisfaction" value="Somehow dissatisfied" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Somehow dissatisfied</label>
            </div>
            <div className="flex items-center">
                <input onChange={handleChange} type="radio" name="satisfaction" value="Very dissatisfied" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Very dissatisfied</label>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Would you recommend this internship to other colleagues?</label>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                    <input onChange={handleChange} type="radio" name="recommendation" value="Yes" required className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <label className="ml-2 text-sm text-gray-700">Yes</label>
                </div>
                <div className="flex items-center">
                    <input onChange={handleChange} type="radio" name="recommendation" value="No" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <label className="ml-2 text-sm text-gray-700">No</label>
                </div>
                <div className="flex items-center">
                    <input onChange={handleChange} type="radio" name="recommendation" value="Maybe" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <label className="ml-2 text-sm text-gray-700">Maybe</label>
                </div>
            </div>
        </div>
        <div className="space-x-2 mt-4">
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}