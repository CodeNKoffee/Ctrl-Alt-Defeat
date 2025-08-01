import { useEffect, useState } from 'react';
import { format, isBefore, startOfDay, isValid, parseISO } from 'date-fns';
import CustomButton from './shared/CustomButton';
import DatePicker from './DatePicker';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function CompanyCreatePost({ onAddPost, onFormChange, initialPost, isEditing, onClose }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [form, setForm] = useState({
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

  const [paidValidation, setPaid] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  // Initialize form with post data if editing or reset if creating
  useEffect(() => {
    if (isEditing && initialPost) {
      // If editing, populate form with initialPost data
      const validInitialPost = { // Ensure all fields are present
        title: initialPost.title || '',
        description: initialPost.description || '',
        startDate: initialPost.startDate || '',
        duration: initialPost.duration || '',
        jobType: initialPost.jobType || 'Full-time',
        jobSetting: initialPost.jobSetting || 'On-site',
        paid: initialPost.paid || 'Paid',
        salary: initialPost.salary || '',
        requirements: initialPost.requirements || '',
        skills: initialPost.skills || [],
      };
      setForm(validInitialPost);
      if (onFormChange) {
        onFormChange(validInitialPost); // Update preview
      }
    } else if (!isEditing) {
      // If creating a new post (or initialPost is not available), reset to default
      const defaultFormState = {
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
      };
      setForm(defaultFormState);
      if (onFormChange) {
        onFormChange(defaultFormState); // Reset preview
      }
    }
    // This effect should run when isEditing status changes or a new initialPost is provided for editing.
    // Crucially, onFormChange is not in dependencies to prevent loops if it's not memoized by parent.
  }, [isEditing, initialPost]); // Removed onFormChange from dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Send updated form data to parent for live preview
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  // const handleDateChange = (date) => {
  //   const updatedForm = { ...form, startDate: date };
  //   setForm(updatedForm);

  //   // Send updated form data to parent for live preview
  //   if (onFormChange) {
  //     onFormChange(updatedForm);
  //   }
  // };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        const updatedForm = {
          ...form,
          skills: [...form.skills, skillInput.trim()],
        };
        setForm(updatedForm);

        // Send updated form data to parent for live preview
        if (onFormChange) {
          onFormChange(updatedForm);
        }
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedForm = {
      ...form,
      skills: form.skills.filter((skill) => skill !== skillToRemove),
    };
    setForm(updatedForm);

    // Send updated form data to parent for live preview
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate) return;
    onAddPost(form);
    const resetForm = {
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
    };
    setForm(resetForm);
    setSkillInput('');

    // Reset preview in parent component
    if (onFormChange) {
      onFormChange(resetForm);
    }
  };

  useEffect(() => {
    if (form.paid === 'Paid') {
      setPaid(true);
    } else {
      setPaid(false);
    }
  }, [form.paid]);

  // Send initial form state on component mount for preview
  useEffect(() => {
    // This effect is intended to run once on mount to set the initial preview
    // if not already handled by the isEditing/initialPost effect.
    // However, the above effect now handles initial setup for both create and edit.
    // If there's no initialPost and it's not editing, it sets a default preview.
    // Consider if this is still needed or if the logic above is sufficient.
    // For safety, let's ensure it doesn't overwrite an existing preview set by `initialPost`.
    if (!isEditing && !initialPost && onFormChange) {
      onFormChange(form); // form here would be the initial empty state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep this to run only on mount if necessary for initial preview setup

  // Function to disable past dates
  const disablePastDates = (date) => {
    if (!isValid(date)) return true;

    try {
      const today = startOfDay(new Date());
      return isBefore(date, today);
    } catch (error) {
      console.error("Error in date validation:", error);
      return false;
    }
  };

  // Common input style classes
  const inputClasses = "w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors";
  const labelClasses = "block text-sm font-medium text-[var(--metallica-blue-800)] mb-1";
  const sectionClasses = "mb-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {onClose && (
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark"
            className="svg-inline--fa fa-xmark text-xl text-gray-500 font-normal"
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z">
            </path>
          </svg>
        </button>
      )}

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.jobTitle')}</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder={safeT('company.posts.form.jobTitlePlaceholder')}
          required
          className={inputClasses}
        />
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.jobDescription')}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder={safeT('company.posts.form.jobDescriptionPlaceholder')}
          required
          className={`${inputClasses} min-h-[100px] resize-vertical`}
        />
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.startDate')} <span className="text-red-500">*</span></label>
        <div className="mt-1">
          <DatePicker
            selectedDate={form.startDate ? new Date(form.startDate) : null}
            onDateChange={date => {
              if (date && isValid(date)) {
                const formatted = format(date, 'yyyy-MM-dd');
                setForm(f => ({ ...f, startDate: formatted }));
                if (onFormChange) onFormChange({ ...form, startDate: formatted });
              } else {
                setForm(f => ({ ...f, startDate: '' }));
                if (onFormChange) onFormChange({ ...form, startDate: '' });
              }
            }}
            value={form.startDate}
            disabled={false}
            inputProps={{
              readOnly: false,
              placeholder: safeT('company.posts.form.selectDate'),
              className: inputClasses + ' cursor-pointer bg-white',
              onFocus: e => e.target.blur && e.target.blur(), // Remove if DatePicker handles focus
            }}
          />
        </div>
        {!form.startDate && (
          <p className="text-red-500 text-xs mt-1">{safeT('company.posts.form.pleaseSelectStartDate')}</p>
        )}
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.duration')}</label>
        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder={safeT('company.posts.form.durationPlaceholder')}
          required
          className={inputClasses}
        />
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.internshipType')}</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="jobType"
              value="Full-time"
              checked={form.jobType === 'Full-time'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-[var(--metallica-blue-600)] border-[var(--metallica-blue-300)]"
            />
            <span className="ml-2 text-[var(--metallica-blue-700]">{safeT('company.posts.filters.fullTime')}</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="jobType"
              value="Part-time"
              checked={form.jobType === 'Part-time'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-[var(--metallica-blue-600)] border-[var(--metallica-blue-300)]"
            />
            <span className="ml-2 text-[var(--metallica-blue-700]">{safeT('company.posts.filters.partTime')}</span>
          </label>
        </div>
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.internshipSetting')}</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="jobSetting"
              value="Remote"
              checked={form.jobSetting === 'Remote'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-[var(--metallica-blue-600)] border-[var(--metallica-blue-300)]"
            />
            <span className="ml-2 text-[var(--metallica-blue-700]">{safeT('company.posts.filters.remote')}</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="jobSetting"
              value="On-site"
              checked={form.jobSetting === 'On-site'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-[var(--metallica-blue-600)] border-[var(--metallica-blue-300)]"
            />
            <span className="ml-2 text-[var(--metallica-blue-700]">{safeT('company.posts.filters.onSite')}</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="jobSetting"
              value="Hybrid"
              checked={form.jobSetting === 'Hybrid'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-[var(--metallica-blue-600)] border-[var(--metallica-blue-300)]"
            />
            <span className="ml-2 text-[var(--metallica-blue-700]">{safeT('company.posts.filters.hybrid')}</span>
          </label>
        </div>
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.paymentStatus')}</label>
        <select
          name="paid"
          value={form.paid}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="Paid">{safeT('company.posts.filters.paid')}</option>
          <option value="Unpaid">{safeT('company.posts.filters.unpaid')}</option>
        </select>
      </div>

      {paidValidation && (
        <div className={sectionClasses}>
          <label className={labelClasses}>{safeT('company.posts.form.salary')}</label>
          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder={safeT('company.posts.form.salaryPlaceholder')}
            required
            className={inputClasses}
          />
        </div>
      )}

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.requirements')}</label>
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          placeholder={safeT('company.posts.form.requirementsPlaceholder')}
          required
          className={`${inputClasses} min-h-[100px] resize-vertical`}
        />
      </div>

      <div className={sectionClasses}>
        <label className={labelClasses}>{safeT('company.posts.form.skills')}</label>
        <div className="w-full">
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillInputChange}
            onKeyDown={handleSkillInputKeyDown}
            placeholder={safeT('company.posts.form.skillsPlaceholder')}
            className={inputClasses}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {form.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-3 py-1 rounded-full flex items-center"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-[var(--metallica-blue-600)] hover:text-[var(--metallica-blue-800)] focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {form.skills.length === 0 && (
            <p className="text-sm text-[var(--metallica-blue-500)] mt-2">
              {safeT('company.posts.form.skillsHelpText')}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        {isEditing ? (
          <CustomButton
            type="submit"
            variant="secondary"
            loadingText="Saving"
            text={safeT('company.posts.form.saveChanges')}
          />
        ) : (
          <CustomButton
            type="submit"
            variant="primary"
            loadingText="Creating"
            text={safeT('company.posts.form.createPost')}
          />
        )}
      </div>
    </form>
  );
}
