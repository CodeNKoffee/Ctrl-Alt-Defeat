import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faMapMarkerAlt, faClock, faUserTie, faListUl, faTimes, faPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import DatePicker from './DatePicker';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkshopForm({ workshop, onSave, onCancel, mode = 'create' }) {
  // Default empty workshop if none provided
  const defaultWorkshop = {
    id: Date.now().toString(),
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    imageUrl: '/images/default-workshop.jpg',
    instructor: '',
    instructorBio: '',
    instructorImage: '/images/default-avatar.png',
    category: 'WORKSHOP',
    agenda: [],
    location: 'Online',
    maxAttendees: 25,
  };

  const [formData, setFormData] = useState(() => {
    if (workshop) { // Edit mode with a workshop provided
      return {
        ...defaultWorkshop, // Start with all default fields
        ...workshop,        // Override with properties from the workshop prop
        startDate: workshop.startDate ? new Date(workshop.startDate) : defaultWorkshop.startDate, // Ensure startDate is a Date
        endDate: workshop.endDate ? new Date(workshop.endDate) : defaultWorkshop.endDate,       // Ensure endDate is a Date
        agenda: workshop.agenda || [] // Ensure agenda is an array
      };
    }
    // Create mode or workshop is initially null/undefined
    return {
      ...defaultWorkshop, // Use all defaults (dates are Date objects, agenda is [])
    };
  });
  const [agendaItem, setAgendaItem] = useState('');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [errors, setErrors] = useState({});

  // Feedback state for successful creation/update
  const [feedback, setFeedback] = useState(null);

  // Reset form when workshop changes (for edit mode)
  useEffect(() => {
    if (workshop) { // Workshop prop is present (edit mode or switched to an existing workshop)
      setFormData({
        ...defaultWorkshop, // Start with all default fields
        ...workshop,        // Override with properties from the workshop prop
        startDate: workshop.startDate ? new Date(workshop.startDate) : defaultWorkshop.startDate, // Ensure startDate is a Date
        endDate: workshop.endDate ? new Date(workshop.endDate) : defaultWorkshop.endDate,       // Ensure endDate is a Date
        agenda: workshop.agenda || [] // Ensure agenda is an array
      });
    } else { // Workshop prop is null/undefined (create mode or workshop cleared)
      setFormData({
        ...defaultWorkshop,
        // agenda is already correctly [] in defaultWorkshop
      });
    }
  }, [workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (name, date) => {
    // Preview the state after this change to make decisions based on the newest data
    const newFormData = {
      ...formData,
      [name]: date
    };

    setFormData(newFormData); // Update state with the new date

    // Clear errors more intelligently
    setErrors(prevErrors => {
      const updatedErrors = { ...prevErrors };

      // 1. Clear any error for the field being directly changed (e.g., if it was marked as required)
      if (updatedErrors[name]) {
        updatedErrors[name] = '';
      }

      // 2. Specifically check and clear the "End time must be after start time" error 
      //    if the new combination of dates is now valid.
      //    This error is stored on `errors.endDate`.
      if (updatedErrors.endDate === 'End time must be after start time') {
        // Check validity using the most up-to-date data from newFormData
        if (newFormData.endDate && newFormData.startDate && newFormData.endDate > newFormData.startDate) {
          updatedErrors.endDate = ''; // Clear the error as the dates are now in correct order
        }
      }
      return updatedErrors;
    });
  };

  const addAgendaItem = () => {
    if (!agendaItem.trim()) return;

    setFormData(prev => ({
      ...prev,
      agenda: [...(prev.agenda || []), agendaItem]
    }));
    setAgendaItem('');
  };

  const removeAgendaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda ? prev.agenda.filter((_, i) => i !== index) : []
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Workshop title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor name is required';
    if (!formData.instructorBio.trim()) newErrors.instructorBio = 'Instructor bio is required';
    if (!formData.agenda || formData.agenda.length === 0) newErrors.agenda = 'At least one agenda item is required';

    // Ensure end date is after start date
    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Show success feedback
      if (mode === 'create') {
        setFeedback('success');
      } else {
        setFeedback('update');
      }

      setTimeout(() => {
        setFeedback(null);
        onSave(formData);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center">
      {/* Feedback overlay - copied exactly from UploadDocuments.jsx */}
      <AnimatePresence>
        {feedback && (
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
              zIndex: 10000,
              background: 'rgba(42, 95, 116, 0.18)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px'
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <motion.div
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: feedback === 'success' ? '#22C55E' : '#318FA8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: 32, color: 'white' }}
                  />
                </div>
              </motion.div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                {feedback === 'success' ? 'Success!' : 'Updated!'}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedback === 'success'
                  ? 'Workshop has been successfully created.'
                  : 'Workshop has been successfully updated.'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row my-6 h-[calc(100vh-3rem)]">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-2 top-2 bg-white rounded-full p-2 text-gray-500 hover:text-gray-800 z-10"
        >
          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
        </button>

        {/* Form Section */}
        <div className="bg-white rounded-tl-xl rounded-bl-xl p-8 overflow-y-auto w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2a5f74] mb-6">
            {mode === 'create' ? 'Create New Workshop' : 'Edit Workshop'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workshop Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workshop Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]`}
                placeholder="Enter workshop title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]`}
                placeholder="Enter workshop description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time*
                </label>
                <DatePicker
                  selectedDate={formData.startDate}
                  onDateChange={(date) => handleDateChange('startDate', date)}
                  className={`w-full px-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time*
                </label>
                <DatePicker
                  selectedDate={formData.endDate}
                  onDateChange={(date) => handleDateChange('endDate', date)}
                  className={`w-full px-4 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            {/* Location & Maximum Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                  placeholder="Enter location (default: Online)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Attendees
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                  placeholder="Maximum number of attendees"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                placeholder="Enter workshop category"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workshop Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                placeholder="Enter image URL"
              />
            </div>

            {/* Instructor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#2a5f74]">Instructor Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Name*
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.instructor ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]`}
                  placeholder="Enter instructor name"
                />
                {errors.instructor && <p className="mt-1 text-sm text-red-500">{errors.instructor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Bio*
                </label>
                <textarea
                  name="instructorBio"
                  value={formData.instructorBio}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2 border ${errors.instructorBio ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]`}
                  placeholder="Enter instructor biography"
                />
                {errors.instructorBio && <p className="mt-1 text-sm text-red-500">{errors.instructorBio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Image URL
                </label>
                <input
                  type="text"
                  name="instructorImage"
                  value={formData.instructorImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                  placeholder="Enter instructor image URL"
                />
              </div>
            </div>

            {/* Workshop Agenda */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#2a5f74]">Workshop Agenda*</h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={agendaItem}
                  onChange={(e) => setAgendaItem(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5DB2C7] focus:border-[#5DB2C7]"
                  placeholder="Add agenda item"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAgendaItem())}
                />
                <button
                  type="button"
                  onClick={addAgendaItem}
                  className="px-4 py-2 bg-[#5DB2C7] text-white rounded-lg hover:bg-[#4AA0B5] transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                </button>
              </div>

              {errors.agenda && <p className="mt-1 text-sm text-red-500">{errors.agenda}</p>}

              {formData.agenda && formData.agenda.length > 0 ? (
                <ul className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {formData.agenda.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No agenda items added yet</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-4 bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white rounded-full hover:bg-[#1a3f54] transition-colors shadow-sm font-medium"
                >
                  {mode === 'create' ? 'Create Workshop' : 'Update Workshop'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-[#F7FBFD] rounded-tr-xl rounded-br-xl p-8 w-full md:w-1/2 overflow-y-auto">
          {/* Unified Preview Header (not sticky, styled like Post Preview) */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[var(--metallica-blue-700)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Workshop Preview
            </h2>
          </div>

          {/* Preview Card - match Post Preview style */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-[var(--metallica-blue-100)] flex-1 flex flex-col">
            {/* Workshop Image */}
            <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
              <img
                src={formData.imageUrl || '/images/default-workshop.jpg'}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Workshop Content */}
            <div className="flex flex-col gap-6">
              {/* Category and Title */}
              <div>
                <span className="text-xs text-blue-600 font-medium mb-2 inline-block">
                  {formData.category || "WORKSHOP"}
                </span>
                <h3 className="text-xl font-bold text-[var(--metallica-blue-800)] mb-2">
                  {formData.title || "Workshop Title"}
                </h3>
                <p className="text-gray-700 text-sm">
                  {formData.description || "Workshop description will appear here"}
                </p>
              </div>

              {/* Workshop Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                <div>
                  <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-xs uppercase tracking-wide">Date & Time</h4>
                  <p className="text-gray-700 text-sm">
                    {formData.startDate.toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })} - {formData.endDate.toLocaleString(undefined, {
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-xs uppercase tracking-wide">Location</h4>
                  <p className="text-gray-700 text-sm">{formData.location || "Online"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-xs uppercase tracking-wide">Maximum Attendees</h4>
                  <p className="text-gray-700 text-sm">{formData.maxAttendees || 25}</p>
                </div>
              </div>

              {/* Instructor */}
              <div>
                <h4 className="text-base font-medium text-[var(--metallica-blue-700)] flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5DB2C7] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Instructor
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={formData.instructorImage || "/images/default-avatar.png"}
                      alt={formData.instructor}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{formData.instructor || "Instructor Name"}</p>
                    <p className="text-sm text-gray-600">{formData.instructorBio || "Instructor biography will appear here"}</p>
                  </div>
                </div>
              </div>

              {/* Agenda */}
              <div>
                <h4 className="text-base font-medium text-[var(--metallica-blue-700)] flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5DB2C7] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Workshop Agenda
                </h4>
                {formData.agenda && formData.agenda.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.agenda.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#5DB2C7] text-white rounded h-5 w-5 text-xs mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">No agenda items added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 