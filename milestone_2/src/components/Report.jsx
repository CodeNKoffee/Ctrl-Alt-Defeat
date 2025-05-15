"use client"
import { useState, useEffect } from "react"
import { CSEN_Courses, DMET_Courses, BioTech_Courses, Law_Courses  } from "../../constants/mockData";

export default function Report({ onAddTile, onCancel }) {
    const [filledReport, setReport] = useState({
        internshipTitle: '',
        companyOrgName: '',
        introduction: '',
        companyDesc: '',
        tasks: '',
        conclusion: '',
        satisfaction: '',
        recommendation: '',
        references: '',
        appendencies: ''
    });

    const [major, setMajor] = useState(null)
    const [courses, setCourses] = useState([]) 
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTile({
            ...filledReport,
            major,
            selectedCourses
        });
        setReport({
            internshipTitle: '',
            companyOrgName: '',
            introduction: '',
            companyDesc: '',
            tasks: '',
            conclusion: '',
            satisfaction: '',
            recommendation: '',
            references: '',
            appendencies: ''
        });
        setMajor(null);
        setSelectedCourses([]);
        document.querySelectorAll('input, textarea').forEach(input => input.value = '');
    };

    const handleMajorChange = (e) => {
        setMajor(e.target.value);
        setSelectedCourses([]); // Reset selected courses when major changes
    };

    const handleCourseSelect = (e) => {
        const selectedCourse = e.target.value;
        if (selectedCourse && !selectedCourses.includes(selectedCourse)) {
            setSelectedCourses((prev) => [...prev, selectedCourse]);
            setCourses((prev) => prev.filter((course) => course !== selectedCourse));
        }
        e.target.value = ""; // Reset the dropdown to allow re-selection
    };

    const handleCourseRemove = (course) => {
        setSelectedCourses((prev) => prev.filter((c) => c !== course));
        setCourses((prev) => [...prev, course]);
    };

    useEffect(() =>{
        if(major === 'CSEN'){
            setCourses(CSEN_Courses)
        }else if(major === 'DMET'){
            setCourses(DMET_Courses)
        }else if(major === 'BioTechnology'){
            setCourses(BioTech_Courses)
        }else if(major === 'Law'){
            setCourses(Law_Courses)
        }
    }, [major])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex flex-col mb-4 md:mb-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-metallica-blue-800 mb-2">Create Internship Report</h2>
                    <p className="text-metallica-blue-700 text-base">Fill in your internship report details and preview your submission before saving.</p>
                </div>
                {onCancel && (
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col lg:flex-row gap-8">
                {/* Left: Form */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center overflow-y-auto">
                    <form className="space-y-6 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                                <input required name="internshipTitle" onChange={handleChange} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select your major:</label>
                                <select required onChange={handleMajorChange} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
                                    <option value="" disabled selected>Select your major</option>
                                    <option value="CSEN">CSEN</option>
                                    <option value="DMET">DMET</option>
                                    <option value="BioTechnology">Biotechnology</option>
                                    <option value="Law">Law</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add courses that helped you during your internship:</label>
                                <select onChange={handleCourseSelect} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
                                    <option value="" disabled selected>Select a course</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization Name:</label>
                                <input required name="companyOrgName" onChange={handleChange} className="mt-1 block w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Introduction:</label>
                                <textarea required name="introduction" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization Description:</label>
                                <textarea required name="companyDesc" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Performed Tasks:</label>
                                <textarea required name="tasks" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion:</label>
                                <textarea required name="conclusion" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">References:</label>
                                <p className="text-sm text-gray-500">(If any external sources are used, provide references for any information quoted)</p>
                                <textarea name="references" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Appendencies:</label>
                                <p className="text-sm text-gray-500">(Upon availability, charts, pictures, etc.)</p>
                                <textarea name="appendencies" onChange={handleChange} className="mt-1 block w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-y" rows="3" />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-red-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit Report</button>
                        </div>
                    </form>
                </div>
                {/* Right: Preview styled like faculty report viewer */}
                <div className="w-full lg:w-1/2 p-8 bg-gray-50 flex flex-col items-center justify-center overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Preview</h3>
                    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8 border border-gray-100 min-h-[500px]">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-sm bg-metallica-blue-50 text-metallica-blue-700 px-2 py-1 rounded">Major: {major || 'N/A'}</span>
                            <span className="text-sm bg-metallica-blue-50 text-metallica-blue-700 px-2 py-1 rounded">Company: {filledReport.companyOrgName || 'N/A'}</span>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Title</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.internshipTitle || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Introduction</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.introduction || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Company/Organization Description</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.companyDesc || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Internship Performed Tasks</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.tasks || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Conclusion</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.conclusion || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">References</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.references || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-metallica-blue-700 mb-2">Appendencies</h2>
                            <div className="text-gray-800 text-base whitespace-pre-line bg-metallica-blue-50 border-l-4 border-metallica-blue-200 pl-4 py-2 rounded">{filledReport.appendencies || <span className='text-gray-400'>Not provided</span>}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
