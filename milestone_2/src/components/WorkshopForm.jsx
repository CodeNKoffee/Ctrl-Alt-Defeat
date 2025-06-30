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
      setFeedback('success');

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
                    background: '#318FA8',
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
                Success!
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {mode === 'create' ? 'Workshop has been successfully created.' : 'Workshop has been successfully updated.'}
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2a5f74] text-white rounded-lg hover:bg-[#1a3f54] transition-colors shadow-md"
                >
                  {mode === 'create' ? 'Create Workshop' : 'Update Workshop'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-[#D9F0F4]/60 backdrop-blur-md rounded-tr-xl rounded-br-xl p-8 w-full md:w-1/2 overflow-y-auto">
          <div className="sticky top-0 bg-[#D9F0F4]/80 backdrop-blur-md p-4 rounded-lg mb-6 z-10">
            <h2 className="text-2xl font-bold text-[#2a5f74]">Workshop Preview</h2>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
            {/* Workshop Image */}
            <div className="relative w-full h-48">
              <img
                src={formData.imageUrl || '/images/default-workshop.jpg'}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Workshop Content */}
            <div className="p-6 space-y-6">
              {/* Category and Title */}
              <div>
                <span className="text-xs text-blue-600 font-medium block mb-2">
                  {formData.category || "WORKSHOP"}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {formData.title || "Workshop Title"}
                </h3>
                <p className="text-gray-600">
                  {formData.description || "Workshop description will appear here"}
                </p>
              </div>

              {/* Workshop Details */}
              <div className="space-y-3 border-t border-b border-gray-100 py-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-[#5DB2C7] mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Date & Time</p>
                    <p className="text-sm text-gray-800">
                      {formData.startDate.toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })} - {formData.endDate.toLocaleString(undefined, {
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-[#5DB2C7] mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Location</p>
                    <p className="text-sm text-gray-800">{formData.location || "Online"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-[#5DB2C7] mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Maximum Attendees</p>
                    <p className="text-sm text-gray-800">{formData.maxAttendees || 25}</p>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-[#2a5f74] flex items-center">
                  <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-[#5DB2C7] mr-2" />
                  Instructor
                </h4>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
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
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-[#2a5f74] flex items-center">
                  <FontAwesomeIcon icon={faListUl} className="h-5 w-5 text-[#5DB2C7] mr-2" />
                  Workshop Agenda
                </h4>
                {formData.agenda && formData.agenda.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.agenda.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#5DB2C7] text-white rounded h-5 w-5 text-xs mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{item}</span>
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