import { useState, useEffect } from "react";
import { CSEN_Courses, DMET_Courses, BioTech_Courses, Law_Courses } from "../../constants/mockData";

export default function ReportCreationDashboard({ onAddTile, onCancel, initialReport, hideTitle = false, showSaveDraftButton = true }) {
  const [filledReport, setReport] = useState({
    internshipTitle: '',
    introduction: '',
    body: '',
    conclusion: '',
    courses: [],
    major: '',
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    if (initialReport) {
      setReport({
        internshipTitle: initialReport.internshipTitle || '',
        introduction: initialReport.introduction || '',
        body: initialReport.body || '',
        conclusion: initialReport.conclusion || '',
        courses: initialReport.courses || [],
        major: initialReport.major || '',
      });
      setSelectedCourses(initialReport.courses || []);
      if (initialReport.major === 'CSEN') setCourses(CSEN_Courses);
      else if (initialReport.major === 'DMET') setCourses(DMET_Courses);
      else if (initialReport.major === 'BioTechnology') setCourses(BioTech_Courses);
      else if (initialReport.major === 'Law') setCourses(Law_Courses);
      else setCourses([]);
    }
  }, [initialReport]);

  const handleMajorChange = (e) => {
    const major = e.target.value;
    setReport((prev) => ({ ...prev, major }));
    setSelectedCourses([]);
    if (major === 'CSEN') setCourses(CSEN_Courses);
    else if (major === 'DMET') setCourses(DMET_Courses);
    else if (major === 'BioTechnology') setCourses(BioTech_Courses);
    else if (major === 'Law') setCourses(Law_Courses);
    else setCourses([]);
  };
  const handleCourseSelect = (e) => {
    const selectedCourse = e.target.value;
    if (selectedCourse && !selectedCourses.includes(selectedCourse)) {
      setSelectedCourses((prev) => [...prev, selectedCourse]);
      setCourses((prev) => prev.filter((course) => course !== selectedCourse));
    }
    e.target.value = "";
  };
  const handleCourseRemove = (course) => {
    setSelectedCourses((prev) => prev.filter((c) => c !== course));
    setCourses((prev) => [...prev, course]);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };
  const handleModalSubmit = (e) => {
    e.preventDefault();
    onAddTile({ ...filledReport, courses: selectedCourses });
    if (onCancel) onCancel();
    setReport({ internshipTitle: '', introduction: '', body: '', conclusion: '', courses: [], major: '' });
    setSelectedCourses([]);
    setCourses([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-8 border border-gray-200">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onCancel}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-metallica-blue-800 mb-4 text-center">
          {initialReport && initialReport.status === 'draft' ? 'Edit Draft Report' : 'Create Internship Report'}
        </h2>
        <form className="space-y-4" onSubmit={handleModalSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required name="internshipTitle" value={filledReport.internshipTitle} onChange={handleFormChange} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select your major</label>
            <select required value={filledReport.major} onChange={handleMajorChange} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
              <option value="" disabled>Select your major</option>
              <option value="CSEN">CSEN</option>
              <option value="DMET">DMET</option>
              <option value="BioTechnology">Biotechnology</option>
              <option value="Law">Law</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add courses that helped you during your internship</label>
            <select onChange={handleCourseSelect} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
              <option value="" disabled>Select a course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCourses.map((course, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 cursor-pointer" onClick={() => handleCourseRemove(course)}>{course}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <textarea required name="introduction" value={filledReport.introduction} onChange={handleFormChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea required name="body" value={filledReport.body} onChange={handleFormChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
            <textarea required name="conclusion" value={filledReport.conclusion} onChange={handleFormChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
          </div>
          <div className="flex gap-2 mt-6">
            <button type="submit" className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {initialReport && initialReport.status === 'draft' ? 'Save Changes' : 'Submit Report'}
            </button>
            {showSaveDraftButton && (
              <button
                type="button"
                onClick={() => { onAddTile({ ...filledReport, courses: selectedCourses, status: 'draft' }); if (onCancel) onCancel(); }}
                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {initialReport && initialReport.status === 'draft' ? 'Save Draft' : 'Save Draft'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
