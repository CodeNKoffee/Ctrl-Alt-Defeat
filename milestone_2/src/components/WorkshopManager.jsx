import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import WorkshopList from './WorkshopList';
import WorkshopForm from './WorkshopForm';
import DeleteWorkshopModal from './DeleteWorkshopModal';
import { sampleWorkshops } from '../../constants/mockData';

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState(sampleWorkshops);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter workshops based on search term
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new workshop
  const handleCreateWorkshop = () => {
    setCurrentWorkshop(null);
    setIsFormOpen(true);
  };

  // Handle edit workshop
  const handleEditWorkshop = (workshop) => {
    setCurrentWorkshop(workshop);
    setIsFormOpen(true);
  };

  // Handle delete workshop
  const handleDeleteWorkshop = (workshopId) => {
    setWorkshops(workshops.filter(w => w.id !== workshopId));
    setConfirmDelete(null);
  };

  // Save workshop (create or update)
  const handleSaveWorkshop = (workshopData) => {
    if (currentWorkshop) {
      // Update existing workshop
      setWorkshops(workshops.map(w =>
        w.id === workshopData.id ? workshopData : w
      ));
    } else {
      // Create new workshop
      setWorkshops([...workshops, { ...workshopData, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
  };

  // Find the workshop title for the delete modal
  const workshopToDelete = confirmDelete ? workshops.find(w => w.id === confirmDelete) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title and Add Workshop Button */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
            MANAGE WORKSHOPS
            <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
          </h1>
          <button
            onClick={handleCreateWorkshop}
            className="mt-4 sm:mt-0 bg-[#2a5f74] hover:bg-[#1a3f54] text-white px-4 py-2 rounded-lg shadow-md flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Workshop
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-[#D9F0F4]/60 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 border border-[#B8E1E9]/50">
          <div className="relative w-full max-w-md flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or instructor..."
              className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faSearch}
                className="h-4 w-4 text-[#5DB2C7]"
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                className="absolute inset-y-0 right-3.5 flex items-center p-1 rounded-full hover:bg-[#B8E1E9]/50 transition-colors duration-200"
                onClick={() => setSearchTerm('')}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-4 h-4 text-[#5DB2C7] hover:text-[#2a5f74]"
                />
              </button>
            )}
          </div>
        </div>

        {/* Workshop List with Management Functions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredWorkshops.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredWorkshops.map(workshop => (
                <div key={workshop.id} className="p-6 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50 transition-colors duration-200">
                  {/* Workshop Image */}
                  <div className="flex-shrink-0 w-full sm:w-20 h-20 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={workshop.imageUrl || "/images/default-workshop.jpg"}
                      alt={workshop.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Workshop Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <span className="text-xs text-blue-600 font-medium mb-1 block">
                          {workshop.category || "WORKSHOP"}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {workshop.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          By {workshop.instructor} • {new Date(workshop.startDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Management Actions */}
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditWorkshop(workshop)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Workshop"
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(workshop.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Workshop"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Workshop Time */}
                    <p className="text-sm text-gray-700 mt-1">
                      {new Date(workshop.startDate).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })} - {new Date(workshop.endDate).toLocaleString(undefined, {
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No workshops found matching your search.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-[#5DB2C7] hover:text-[#2a5f74] underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Workshop Form Modal */}
      {isFormOpen && (
        <WorkshopForm
          workshop={currentWorkshop}
          onSave={handleSaveWorkshop}
          onCancel={() => setIsFormOpen(false)}
          mode={currentWorkshop ? 'edit' : 'create'}
        />
      )}

      {/* Delete Workshop Modal */}
      <DeleteWorkshopModal
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onDelete={() => handleDeleteWorkshop(confirmDelete)}
        workshopTitle={workshopToDelete?.title}
      />
    </div>
  );
} 