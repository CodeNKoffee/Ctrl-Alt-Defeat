import { useState, useRef, useEffect } from 'react';
import CompanyPost from './CompanyPost';
import CompanyCreatePost from './CompanyCreatePost';
import DeleteTileConfirmation from './DeleteTileConfirmation';

export default function PostTiles({ searchOverride, filterOverride }) {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingPostIndex, setDeletingPostIndex] = useState(null);
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

  const handleAddPost = (newPost) => {
    if (editingPost !== null) {
      // We're updating an existing post
      setPosts((prevPosts) =>
        prevPosts.map((post, index) =>
          index === editingPost ? newPost : post
        )
      );
      setEditingPost(null);
    } else {
      // We're creating a new post
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
    setShowForm(false);
  };

  const handleFormChange = (updatedForm) => {
    setPostPreview(updatedForm);
  };

  const handleUpdateClick = (post) => {
    const postIndex = posts.findIndex(p =>
      p.title === post.title &&
      p.description === post.description
    );

    if (postIndex !== -1) {
      // Create a deep copy of the post to ensure we're passing a complete object
      const postToEdit = JSON.parse(JSON.stringify(posts[postIndex]));
      
      // First set the preview to match the post we're editing
      setPostPreview(postToEdit);
      
      // Then mark this post as the one being edited
      setEditingPost(postIndex);
      
      // Finally show the form
      setShowForm(true);
    }
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
      // If we're closing the form, clear the editing state
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
        // Remove the value if it's already selected
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Add the value if it's not selected
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

  // Filter posts based on search query (only title) and filters
  const filteredPosts = posts.filter(post => {
    // Filter by title search
    const titleMatches = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatches) return false;

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
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto py-8">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Header bar */}
              <div className="bg-[var(--metallica-blue-50)] text-[var(--metallica-blue-700)] py-3 px-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingPost !== null ? 'Update Post' : 'Create New Post'}
                </h2>
                <button
                  onClick={toggleCreatePost}
                  className="p-1 rounded-full hover:bg-[var(--metallica-blue-100)] transition"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#E8F7FB"/>
                    <path d="M15.3 8.7L12 12M12 12L8.7 15.3M12 12L15.3 15.3M12 12L8.7 8.7" stroke="#2A5F74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                      initialPost={editingPost !== null ? posts[editingPost] : null}
                      isEditing={editingPost !== null}
                    />
                  </div>
                </div>

                {/* Right side - Live Preview - This div will NOT scroll with the form */}
                <div className="lg:w-1/2 p-6 overflow-y-auto bg-white min-h-full h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--metallica-blue-700)] bg-white">Post Preview</h2>
                  <div className="bg-white rounded-lg shadow-md p-6 border border-[var(--metallica-blue-100)] flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--metallica-blue-800)]">
                          {postPreview.title || "Job Title"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {postPreview.jobSetting && (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium border flex items-center
                              ${postPreview.jobSetting === 'Remote' ? 'bg-teal-100 text-teal-700 border-teal-200' : ''}
                              ${postPreview.jobSetting === 'On-site' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : ''}
                              ${postPreview.jobSetting === 'Hybrid' ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : ''}
                            `}>
                              {postPreview.jobSetting}
                            </span>
                          )}

                          {postPreview.jobType && (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium border flex items-center
                              ${postPreview.jobType === 'Full-time' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                              ${postPreview.jobType === 'Part-time' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                            `}>
                              {postPreview.jobType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-2 py-1 rounded text-sm">
                          {postPreview.paid || "Payment Status"}
                        </span>
                        {postPreview.paid === 'Paid' && postPreview.salary && (
                          <p className="text-[var(--metallica-green-pop-color)] font-medium mt-1">{postPreview.salary}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">Description</h4>
                      <p className="text-gray-700 mb-4 text-sm">
                        {postPreview.description || "Job description will appear here..."}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)]">Start Date</h4>
                          <p className="text-gray-700 text-sm">
                            {formatDate(postPreview.startDate) || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)]">Duration</h4>
                          <p className="text-gray-700 text-sm">
                            {postPreview.duration || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {postPreview.requirements && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">Requirements</h4>
                        <p className="text-gray-700 text-sm">{postPreview.requirements}</p>
                      </div>
                    )}

                    {postPreview.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)]">Skills</h4>
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
                    <span className="font-semibold">Create Post</span>
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
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm p-8 border border-[var(--metallica-blue-100)]">
              {/* Only show the "+ Post" button when we have posts but filtering returns none */}
              {posts.length > 0 && (
                <div className="flex justify-end mb-4">
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
                      <span className="font-semibold">Create Post</span>
                    </span>
                  </button>
                </div>
              )}
              
              <p className="text-[var(--metallica-blue-600)] text-lg mb-4">
                {posts.length > 0 ? 'No posts match your search' : 'No internship posts yet.'}
              </p>
              
              {/* Only show "Create Your First Post" button when there are no posts at all */}
              {!showForm && posts.length === 0 && (
                <button
                  onClick={toggleCreatePost}
                  className="bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white px-6 py-2 rounded-md shadow-sm transition-colors font-medium"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
