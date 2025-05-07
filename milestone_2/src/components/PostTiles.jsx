import { useState } from 'react';
import CompanyPost from './CompanyPost';
import CompanyCreatePost from './CompanyCreatePost';

export default function PostTiles() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--metallica-blue-800)]">Internship Posts</h1>
        <button
          onClick={toggleCreatePost}
          className="bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white px-6 py-2 rounded-md shadow-sm transition-colors font-medium"
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
                          <div className="flex items-center text-gray-600 mt-1">
                            <span className="mr-4">{postPreview.jobSetting || "Job Setting"}</span>
                            <span>{postPreview.jobType || "Job Type"}</span>
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="max-w-sm w-full">
              <CompanyPost 
                post={post} 
                onUpdateClick={handleUpdateClick}
                compact={true}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm p-8 border border-[var(--metallica-blue-100)]">
            <p className="text-[var(--metallica-blue-600)] text-lg mb-4">No internship posts yet.</p>
            {!showForm && (
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
