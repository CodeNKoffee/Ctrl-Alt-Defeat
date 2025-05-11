"use client"
import { useState, useEffect } from "react"

export default function Report({onAddTile}) {
    const [filledReport, setReport] = useState({
        internshipTitle: '',
        companyOrgName: '',
        introduction: '',
        companyDesc: '',
        tasks: '',
        evaluation: '',
        conclusion: '',
        satisfaction: '',
        recommendation: '',
        references: '',
        appendencies: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTile(filledReport);
        setReport({
            internshipTitle: '',
            companyOrgName: '',
            introduction: '',
            companyDesc: '',
            tasks: '',
            evaluation: '',
            conclusion: '',
            satisfaction: '',
            recommendation: '',
            references: '',
            appendencies: ''
        });
        document.querySelectorAll('input, textarea').forEach(input => input.value = '');
    };

    return (
        <div className="p-6 bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Please fill the following internship report</h3>
            <form className="space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internship Title:</label>
                        <input required name="internshipTitle" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company/Organization Name:</label>
                        <input required name="companyOrgName" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Introduction:</label>
                        <textarea required name="introduction" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company/Organization Description:</label>
                        <textarea required name="companyDesc" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internship Performed Tasks:</label>
                        <textarea required name="tasks" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internship Evaluation</label>
                        <p className="text-sm text-gray-500">
                            What skills do you think that you have gained from the internship? Did the internship meet your expectations? 
                            If not, please explain why? How do you think the internship will influence your future career plans? 
                            How do you think the internship activities that you carried out are correlated with your studies? 
                            Which of the academic courses that you have taken in GUC were the most related to your internship?
                        </p>
                        <textarea required name="evaluation" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Conclusion:</label>
                        <textarea required name="conclusion" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Please rate your satisfaction with the internship experience</label>
                        <div className="flex flex-col space-y-2">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">References:</label>
                        <p className="text-sm text-gray-500">(If any external sources are used, provide references for any information quoted)</p>
                        <textarea name="references" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Appendencies:</label>
                        <p className="text-sm text-gray-500">(Upon availability, charts, pictures, etc.)</p>
                        <textarea name="appendencies" onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y" rows="3" />
                    </div>
                </div>

                <div>
                    <button type="submit" className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit Report</button>
                </div>
            </form>
        </div>
    );
}