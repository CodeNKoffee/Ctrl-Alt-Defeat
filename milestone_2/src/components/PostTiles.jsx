import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import CompanyPost from './CompanyPost';
import CompanyCreatePost from './CompanyCreatePost';
import DeleteTileConfirmation from './DeleteTileConfirmation';
import { useTranslation } from 'react-i18next';
import { createSafeT, translateFilterValue } from '@/lib/translationUtils';

export default function PostTiles({ searchOverride, filterOverride }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingPostIndex, setDeletingPostIndex] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [filters, setFilters] = useState({
    jobType: [],
    jobSetting: [],
    paymentStatus: []
  });
  const [postPreview, setPostPreview] = useState({
    title: '',
    description: '',
    startDate: '',
    duration: '',
    jobType: 'Full-time',
    jobSetting: 'On-site',
    paid: 'Paid',
    salary: '',
    requirements: '',
    skills: [],
  });

  // Use searchOverride if provided by parent component
  useEffect(() => {
    if (searchOverride !== undefined) {
      setSearchQuery(searchOverride);
    }
  }, [searchOverride]);

  // Use filterOverride if provided by parent component
  useEffect(() => {
    if (filterOverride) {
      setFilters(prevFilters => ({
        ...prevFilters,
        jobType: filterOverride.jobType || [],
        jobSetting: filterOverride.jobSetting || [],
        paymentStatus: filterOverride.paymentStatus || []
      }));
    }
  }, [filterOverride]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleAddPost = (newPostData) => {
    const isUpdating = !!editingPost;
    if (isUpdating) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          (post.title === editingPost.title && post.description === editingPost.description)
            ? { ...post, ...newPostData }
            : post
        )
      );
      setEditingPost(null);
      setFeedbackModal({ show: true, type: 'update', message: safeT('company.posts.postUpdatedSuccess') });
    } else {
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setFeedbackModal({ show: true, type: 'create', message: safeT('company.posts.postCreatedSuccess') });
    }
    setPostPreview({
      title: '',
      description: '',
      startDate: '',
      duration: '',
      jobType: 'Full-time',
      jobSetting: 'On-site',
      paid: 'Paid',
      salary: '',
      requirements: '',
      skills: [],
    });

    setTimeout(() => {
      setFeedbackModal(null);
      setShowForm(false);
    }, 2500);
  };

  const handleFormChange = (updatedForm) => {
    setPostPreview(updatedForm);
  };

  const handleUpdateClick = (postToEdit) => {
    const postCopy = JSON.parse(JSON.stringify(postToEdit));
    setEditingPost(postCopy);
    setPostPreview(postCopy);
    setShowForm(true);
  };

  const handleDeleteClick = (post) => {
    const postIndex = posts.findIndex(p =>
      p.title === post.title &&
      p.description === post.description
    );

    if (postIndex !== -1) {
      setDeletingPostIndex(postIndex);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPostIndex !== null) {
      setPosts(prevPosts => prevPosts.filter((_, index) => index !== deletingPostIndex));
      setDeletingPostIndex(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPostIndex(null);
  };

  const toggleCreatePost = () => {
    if (showForm) {
      setEditingPost(null);
      setPostPreview({
        title: '',
        description: '',
        startDate: '',
        duration: '',
        jobType: 'Full-time',
        jobSetting: 'On-site',
        paid: 'Paid',
        salary: '',
        requirements: '',
        skills: [],
      });
    }
    setShowForm(!showForm);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };

      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }

      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      jobSetting: [],
      paymentStatus: []
    });
  };

  // Filter posts based on search query (title, description, skills) and filters
  const filteredPosts = posts.filter(post => {
    // Search: match on title, description, or skills (case-insensitive, partial match)
    const search = searchQuery.trim().toLowerCase();
    const titleMatches = post.title?.toLowerCase().includes(search);
    const descriptionMatches = post.description?.toLowerCase().includes(search);
    const skillsMatches = Array.isArray(post.skills) && post.skills.some(skill => skill.toLowerCase().includes(search));
    const searchMatches = !search || titleMatches || descriptionMatches || skillsMatches;
    if (!searchMatches) return false;

    // Filter by job type
    if (filters.jobType.length > 0 && !filters.jobType.includes(post.jobType)) {
      return false;
    }

    // Filter by job setting
    if (filters.jobSetting.length > 0 && !filters.jobSetting.includes(post.jobSetting)) {
      return false;
    }

    // Filter by payment status
    if (filters.paymentStatus.length > 0 && !filters.paymentStatus.includes(post.paid)) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto pt-0 pb-8">
      {/* Success Feedback Modal */}
      <AnimatePresence>
        {feedbackModal && feedbackModal.show && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000, // Ensure it's above other content
              background: 'rgba(42, 95, 116, 0.18)' // Semi-transparent background
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFeedbackModal(null)} // Optional: close on click outside
          >
            <motion.div
              style={{
                background: 'white',
                padding: '30px 35px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
                minWidth: '320px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
              <motion.div
                style={{
                  marginBottom: '20px',
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: feedbackModal.type === 'create' ? '#22C55E' : '#318FA8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ fontSize: 36, color: 'white' }}
                />
              </motion.div>
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#2A5F74', marginBottom: '8px' }}>
                {feedbackModal.type === 'create' ? safeT('company.posts.success') : safeT('company.posts.updated')}
              </div>
              <div style={{ fontSize: '16px', color: '#4B5563' }}>
                {feedbackModal.message}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto py-8">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Header bar */}
              <div className="bg-[var(--metallica-blue-50)] text-[var(--metallica-blue-700)] p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {editingPost ? safeT('company.posts.updatePost') : safeT('company.posts.createNewPost')}
                </h2>
                <button
                  onClick={toggleCreatePost}
                  className="p-1 rounded-full hover:bg-[var(--metallica-blue-100)] transition"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#E8F7FB" />
                    <path d="M15.3 8.7L12 12M12 12L8.7 15.3M12 12L15.3 15.3M12 12L8.7 8.7" stroke="#2A5F74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row h-[calc(90vh-56px)]">
                {/* Left side - Form - This div will be scrollable */}
                <div className="lg:w-1/2 p-6 overflow-y-auto bg-[var(--metallica-blue-50)] min-h-full h-full flex flex-col">
                  <div className="bg-[var(--metallica-blue-50)] rounded-lg border border-[var(--metallica-blue-200)] p-6 flex-1 flex flex-col">
                    <CompanyCreatePost
                      onAddPost={handleAddPost}
                      onFormChange={handleFormChange}
                      initialPost={editingPost}
                      isEditing={!!editingPost}
                    />
                  </div>
                </div>

                {/* Right side - Live Preview - This div will NOT scroll with the form */}
                <div className="lg:w-1/2 p-6 overflow-y-auto bg-white min-h-full h-full flex flex-col">

                  <h2 className="text-xl font-bold mb-4 text-[var(--metallica-blue-700)] bg-white  flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {safeT('company.posts.postPreview')}</h2>
                  <div className="bg-white rounded-lg shadow-md p-6 border border-[var(--metallica-blue-100)] flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-xl font-bold text-[var(--metallica-blue-800)] break-words overflow-wrap-anywhere">
                          {postPreview.title || safeT('company.posts.form.jobTitlePreview')}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {postPreview.jobSetting && (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium border flex items-center
                              ${postPreview.jobSetting === 'Remote' ? 'bg-teal-100 text-teal-700 border-teal-200' : ''}
                              ${postPreview.jobSetting === 'On-site' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : ''}
                              ${postPreview.jobSetting === 'Hybrid' ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : ''}
                            `}>
                              {translateFilterValue(safeT, postPreview.jobSetting, 'jobSetting')}
                            </span>
                          )}

                          {postPreview.jobType && (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium border flex items-center
                              ${postPreview.jobType === 'Full-time' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                              ${postPreview.jobType === 'Part-time' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                            `}>
                              {translateFilterValue(safeT, postPreview.jobType, 'jobType')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-2 py-1 rounded text-sm">
                          {postPreview.paid ? translateFilterValue(safeT, postPreview.paid, 'paymentStatus') : safeT('company.posts.form.paymentStatus')}
                        </span>
                        {postPreview.paid === 'Paid' && postPreview.salary && (
                          <p className="text-[var(--metallica-green-pop-color)] font-medium mt-1">{postPreview.salary}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">{safeT('company.posts.form.jobDescription')}</h4>
                      <p className="text-gray-700 mb-4 text-sm break-words">
                        {postPreview.description || safeT('company.posts.form.jobDescriptionPlaceholder')}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)]">{safeT('company.posts.form.startDate')}</h4>
                          <p className="text-gray-700 text-sm">
                            {formatDate(postPreview.startDate) || safeT('company.posts.form.notSpecified')}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)]">{safeT('company.posts.form.duration')}</h4>
                          <p className="text-gray-700 text-sm">
                            {postPreview.duration || safeT('company.posts.form.notSpecified')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {postPreview.requirements && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">{safeT('company.posts.form.requirements')}</h4>
                        <p className="text-gray-700 text-sm">{postPreview.requirements}</p>
                      </div>
                    )}

                    {postPreview.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">{safeT('company.posts.form.skills')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {postPreview.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingPostIndex !== null && (
        <DeleteTileConfirmation
          type="post"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Post grid with conditional create button */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPosts.length > 0 ? (
            <>
              {/* Create post button positioned inside the first white container - only shown when there are posts */}
              <div className="col-span-full mb-4 flex justify-end">
                <button
                  onClick={toggleCreatePost}
                  className="relative z-10 bg-[#5DB2C7] hover:bg-[#4AA0B5] text-white rounded-full shadow-md transition-all duration-500 flex items-center overflow-hidden group h-10"
                  aria-label="Create new post"
                >
                  {/* Plus icon in its own circular bubble - lighter with outline */}
                  <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full z-10 border-2 border-[#B8E1E9]">
                    <span className="text-xl font-bold text-[#5DB2C7]">+</span>
                  </span>

                  {/* Text part that expands on hover - now with bold text and slower transition */}
                  <span className="max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out overflow-hidden whitespace-nowrap pr-0 group-hover:pr-4 ml-0 group-hover:ml-1">

                    <span className="font-semibold">{safeT('company.posts.createPost')}</span>
                  </span>
                </button>
              </div>

              {/* Posts display */}
              {filteredPosts.map((post, index) => (
                <div key={index} className="max-w-sm w-full">
                  <CompanyPost
                    post={post}
                    onUpdateClick={handleUpdateClick}
                    onDeleteClick={handleDeleteClick}
                    compact={true}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-full p-16 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">
                {posts.length > 0 ? safeT('company.posts.noMatchingPosts') : safeT('company.posts.noPostsFound')}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {posts.length > 0 ? safeT('company.posts.adjustSearchFilter') : safeT('company.posts.createFirstMessage')}
              </p>

              {/* Only show the "+ Post" button when we have posts but filtering returns none */}
              {posts.length > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={toggleCreatePost}
                    className="relative z-10 bg-[#5DB2C7] hover:bg-[#4AA0B5] text-white rounded-full shadow-md transition-all duration-500 flex items-center overflow-hidden group h-10"
                    aria-label="Create new post"
                  >
                    {/* Plus icon in its own circular bubble - lighter with outline */}
                    <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full z-10 border-2 border-[#B8E1E9]">
                      <span className="text-xl font-bold text-[#5DB2C7]">+</span>
                    </span>

                    {/* Text part that expands on hover - now with bold text and slower transition */}
                    <span className="max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out overflow-hidden whitespace-nowrap pr-0 group-hover:pr-4 ml-0 group-hover:ml-1">
                      <span className="font-semibold">{safeT('company.posts.createPost')}</span>
                    </span>
                  </button>
                </div>
              )}

              {/* Only show "Create Your First Post" button when there are no posts at all */}
              {!showForm && posts.length === 0 && (
                <button
                  onClick={toggleCreatePost}
                  className="mt-4 bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white px-6 py-2 rounded-md shadow-sm transition-colors font-medium"
                >
                  {safeT('company.posts.createFirstPost')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
