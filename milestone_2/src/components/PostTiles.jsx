import { useState } from 'react';
import CompanyPost from './CompanyPost';
import CompanyCreatePost from './CompanyCreatePost';
import DeleteTileConfirmation from './DeleteTileConfirmation';

export default function PostTiles() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingPostIndex, setDeletingPostIndex] = useState(null);
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
      setEditingPost(postIndex);
      setPostPreview(post);
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

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    const searchText = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(searchText) ||
      post.description?.toLowerCase().includes(searchText) ||
      post.skills?.some(skill => skill.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--metallica-blue-800)] mb-6">Internship Posts</h1>
      
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center w-full sm:w-2/3">
          {/* Search Bar */}
          <div className="relative flex-grow mr-2">
            <input
              type="text"
              placeholder="Search posts by title, description, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[var(--metallica-blue-200)] rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-[var(--metallica-blue-500)]"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          {/* Filter Button */}
          <button className="flex items-center justify-center bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] p-2 rounded-md hover:bg-[var(--metallica-blue-200)] transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
              />
            </svg>
          </button>
        </div>
        
        {/* Create Post Button */}
        <button
          onClick={toggleCreatePost}
          className="bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white px-6 py-2 rounded-md shadow-sm transition-colors font-medium w-full sm:w-auto"
        >
          {showForm ? 'Cancel' : 'Create New Post'}
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto py-8">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-6xl max-h-[90vh] overflow-auto">
            <div className="relative">
              {/* Header bar */}
              <div className="bg-[var(--metallica-blue-700)] text-white py-3 px-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingPost !== null ? 'Update Post' : 'Create New Post'}
                </h2>
                <button 
                  onClick={toggleCreatePost}
                  className="text-white hover:text-[var(--metallica-blue-100)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left side - Form */}
                  <div className="lg:w-1/2 p-6 bg-[var(--metallica-blue-50)] rounded-lg border border-[var(--metallica-blue-200)]">
                    <CompanyCreatePost 
                      onAddPost={handleAddPost}
                      onFormChange={handleFormChange}
                      initialPost={editingPost !== null ? posts[editingPost] : null}
                      isEditing={editingPost !== null}
                    />
                  </div>
                  
                  {/* Right side - Live Preview */}
                  <div className="lg:w-1/2">
                    <h2 className="text-xl font-semibold mb-4 text-[var(--metallica-blue-700)]">Post Preview</h2>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[var(--metallica-blue-100)]">
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
                                ${postPreview.jobType === 'Internship' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                                ${postPreview.jobType === 'Contract' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                                ${postPreview.jobType === 'Temporary' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
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
        </div>
      )}
      
      {deletingPostIndex !== null && (
        <DeleteTileConfirmation 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={index} className="max-w-sm w-full">
              <CompanyPost 
                post={post} 
                onUpdateClick={handleUpdateClick}
                onDeleteClick={handleDeleteClick}
                compact={true}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm p-8 border border-[var(--metallica-blue-100)]">
            <p className="text-[var(--metallica-blue-600)] text-lg mb-4">
              {posts.length > 0 ? 'No posts match your search' : 'No internship posts yet.'}
            </p>
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
  );
}
