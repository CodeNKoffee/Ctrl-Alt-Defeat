import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import WorkshopList from './WorkshopList';
import WorkshopForm from './WorkshopForm';
import DeleteWorkshopModal from './DeleteWorkshopModal';
import { sampleWorkshops } from '../../constants/mockData';
import CustomButton from './shared/CustomButton';

export default function WorkshopManager({ instructorFilter = 'all', searchTerm = '' }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [workshops, setWorkshops] = useState(sampleWorkshops);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter workshops based on search term
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstructor = instructorFilter === 'all' || workshop.instructor === instructorFilter;
    return matchesSearch && matchesInstructor;
  });

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
    <div className="container mx-auto py-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title and Add Workshop Button */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <CustomButton
            onClick={handleCreateWorkshop}
            variant="primary"
            text={safeT('scad.workshops.addNewWorkshop')}
            icon={faPlus}
            className="text-lg font-semibold"
          />
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
                        <span className="text-xs text-metallica-blue-600 font-medium mb-1 block">
                          {workshop.category || "WORKSHOP"}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {workshop.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          By {workshop.instructor} • {workshop.startDate ? new Date(workshop.startDate).toLocaleDateString() : workshop.date ? new Date(workshop.date).toLocaleDateString() : 'Date TBD'}
                        </p>
                      </div>

                      {/* Management Actions */}
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditWorkshop(workshop)}
                          className="p-2 text-metallica-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                      {workshop.startDate && workshop.endDate ? (
                        `${new Date(workshop.startDate).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })} - ${new Date(workshop.endDate).toLocaleString(undefined, {
                          timeStyle: 'short'
                        })}`
                      ) : workshop.date && workshop.time ? (
                        `${new Date(workshop.date).toLocaleDateString()} • ${workshop.time}`
                      ) : (
                        'Schedule TBD'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No workshops found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
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
        slideDirection="left"
      />
    </div>
  );
} 