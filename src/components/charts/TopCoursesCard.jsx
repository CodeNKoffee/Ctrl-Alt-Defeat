const TopCoursesCard = ({ courses }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"> {/* Reduced padding */}
      <div className="flex justify-between items-center mb-3"> {/* Reduced margin-bottom */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Most Beneficial Courses</h3>
          <p className="text-xs text-gray-500 mt-1">Based on student internship testimonies</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Top {courses.length}
        </span>
      </div>
      
      <div className="space-y-3"> {/* Reduced vertical spacing */}
        {courses.map((course, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                {index + 1}
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {course.name}
              </p>
              {course.testimonial && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  "{course.testimonial}"
                </p>
              )}
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < course.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {course.rating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 text-center"> {/* Reduced margin/padding */}
        <p className="text-xs text-gray-500">
          Based on analysis of 150+ student internship evaluations
        </p>
      </div>
    </div>
  );
}

export default TopCoursesCard;