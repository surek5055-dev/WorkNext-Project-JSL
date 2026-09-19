import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mentor } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { X, UserPlus, CheckCircle2, AlertCircle, Briefcase, Award, Clock, DollarSign, Image } from 'lucide-react';

interface RegisterMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMentorCreated: (mentor: Mentor) => void;
}

const AVAILABLE_SPECIALTIES = [
  'AI Career Transition',
  'Resume Optimization',
  'Technical Interviews',
  'Salary Negotiation',
  'Portfolio Reviews',
  'System Design',
  'Executive Leadership',
  'Full Stack Engineering',
  'Product Management'
];

export const RegisterMentorModal: React.FC<RegisterMentorModalProps> = ({
  isOpen,
  onClose,
  onMentorCreated
}) => {
  const { user, isLoggedIn } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.title || '');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(user?.skills?.slice(0, 3) || []);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      if (!name && user.name) setName(user.name);
      if (!role && user.title) setRole(user.title);
      if (!bio && user.bio) setBio(user.bio);
      if (!avatar && user.avatar) setAvatar(user.avatar);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleAddCustomSpecialty = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSpecialty.trim();
    if (trimmed && !selectedSpecialties.includes(trimmed)) {
      setSelectedSpecialties([...selectedSpecialties, trimmed]);
      setCustomSpecialty('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setErrorMsg('Full Name and Professional Role/Headline are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Send only what the user entered without generating fake details
    const mentorPayload: Record<string, any> = {
      name: name.trim(),
      role: role.trim(),
      specialties: selectedSpecialties,
    };

    if (user?.id) mentorPayload.userId = user.id;
    if (user?.email) mentorPayload.userEmail = user.email;
    if (company.trim()) mentorPayload.company = company.trim();
    if (bio.trim()) mentorPayload.bio = bio.trim();
    if (hourlyRate.trim()) mentorPayload.hourlyRate = hourlyRate.trim();
    if (availability.trim()) mentorPayload.availability = availability.trim();
    if (avatar.trim()) mentorPayload.avatar = avatar.trim();

    try {
      const res = await fetch('/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id ? { 'x-user-id': user.id } : {}),
          ...(user?.email ? { 'x-user-email': user.email } : {}),
        },
        body: JSON.stringify(mentorPayload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to register mentor profile');
      }

      setSuccessMsg('Mentor profile registered with status: Pending. Awaiting review before appearing in public directory.');
      if (json.data) {
        onMentorCreated(json.data);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error saving mentor:', err);
      setErrorMsg(err.message || 'Failed to connect to database. Please verify inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-xl w-full max-w-lg p-6 sm:p-8 space-y-5 text-stone-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 font-display">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center border border-teal-200/80 dark:border-teal-800/60">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Register as a Mentor</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                Create your verified profile in Supabase to guide job seekers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0F766E] dark:text-teal-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Priya Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                Current Company / Org
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Google Cloud / Microsoft"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
                <Briefcase className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold">
              Professional Role / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Staff AI Engineer & Technical Hiring Lead"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold">
              Specialties & Expertise Focus <span className="text-stone-400 font-normal">(Click to select)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {AVAILABLE_SPECIALTIES.map(spec => {
                const isSelected = selectedSpecialties.includes(spec);
                return (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0F766E] text-white border-teal-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-teal-400'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>

            {/* Custom specialty input */}
            <div className="flex gap-2 pt-1.5">
              <input
                type="text"
                placeholder="Or add custom specialty (press Enter)..."
                value={customSpecialty}
                onChange={e => setCustomSpecialty(e.target.value)}
                onKeyDown={handleAddCustomSpecialty}
                className="flex-1 px-3 py-1.5 text-[11px] rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
              />
              <button
                type="button"
                onClick={handleAddCustomSpecialty}
                className="px-3 py-1.5 text-[11px] rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold">
              Bio & Guidance Philosophy
            </label>
            <textarea
              rows={2}
              placeholder="Share your experience helping candidates crack interviews, optimize resumes, and navigate career transitions..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                Availability Slot
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tomorrow, 4:00 PM IST"
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
                <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                Session Rate / Model
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Free / 1:1 Booking"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
                <DollarSign className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold">
              Profile Picture / Avatar URL <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or leave blank for default"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
              />
              <Image className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0F766E] hover:bg-[#0D655E]"
            >
              {isSubmitting ? 'Saving Profile...' : 'Save & Join as Mentor'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
