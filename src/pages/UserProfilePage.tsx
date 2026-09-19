import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';
import { MapPin, Plus, X, Save, CheckCircle2, Sparkles, User as UserIcon, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { hasSufficientProfileData } from '../types';

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    title: user.title || '',
    location: user.location || '',
    phone: user.phone || '',
    website: user.website || '',
    bio: user.bio || '',
    preferredLocation: user.preferredLocation || '',
    desiredSalary: user.desiredSalary || ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(user.skills || []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = skills;
    const hasBasic = Boolean(formData.title.trim() && updatedSkills.length > 0 && formData.location.trim());
    const hasResume = Boolean(user.resumeFileName?.trim());
    
    // Only display values returned from real connected APIs or the user's actual AI/resume analysis.
    // Do not invent or generate readiness scores.
    const newReadiness = (user.hasAnalyzedResume && user.detailedAnalysis?.readinessScore)
      ? user.detailedAnalysis.readinessScore
      : (user.hasAnalyzedResume && user.readinessScore ? user.readinessScore : 0);

    setUser(prev => ({
      ...prev,
      ...formData,
      skills: updatedSkills,
      readinessScore: newReadiness
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isProfileComplete = hasSufficientProfileData(user);
  const showReadiness = Boolean(user.hasAnalyzedResume && user.readinessScore && user.readinessScore > 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center font-bold text-2xl font-display shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-8 h-8" />}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-display">
                  {user.name || 'Your Profile'}
                </h1>
                {isProfileComplete && (
                  <CheckCircle2 className="w-5 h-5 text-[#0F766E] dark:text-teal-400 fill-current" />
                )}
              </div>
              <p className={`text-xs sm:text-sm font-semibold font-sans mt-0.5 ${
                user.title ? 'text-[#0F766E] dark:text-teal-400' : 'text-stone-400 dark:text-stone-500 italic'
              }`}>
                {user.title || 'Add your professional title'}
              </p>
              <p className={`text-xs flex items-center gap-1 mt-1 font-sans ${
                user.location ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400 dark:text-stone-500 italic'
              }`}>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {user.location || 'Add your location'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-center min-w-[200px] max-w-xs font-sans">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Readiness Index</p>
            {showReadiness ? (
              <>
                <p className="text-3xl font-extrabold text-[#0F766E] dark:text-teal-400 flex items-center justify-center gap-1 font-display mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-500" /> {user.readinessScore}%
                </p>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold mt-0.5">
                  Calculated from verified profile & resume
                </p>
              </>
            ) : (
              <div className="mt-1 space-y-1">
                <p className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">--</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                  Pending data
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 rounded-[20px] p-6 sm:p-8 shadow-xs space-y-6 font-sans">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display">Professional Information</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Your profile information is used for personalized job matching and readiness calculation.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-[#0F766E] bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                ✓ Profile Updated Successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Add your full name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                placeholder="Add your professional title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Primary Location
              </label>
              <input
                type="text"
                placeholder="Add your location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Add your phone number"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target Salary Range
              </label>
              <input
                type="text"
                placeholder="Add your desired salary range"
                value={formData.desiredSalary}
                onChange={e => setFormData({ ...formData, desiredSalary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Preferred Work Location Mode
              </label>
              <input
                type="text"
                placeholder="Add your preference (e.g. Remote, Hybrid, On-site)"
                value={formData.preferredLocation}
                onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Short Professional Bio
            </label>
            <textarea
              rows={3}
              placeholder="Add your professional bio and career goals..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Skill Tags */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Verified Technical Skills
              </label>
              <span className="text-[11px] text-stone-400">{skills.length} skills added</span>
            </div>

            {skills.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-900/50">
                <p>No skills added yet. Add your skills below to personalize job matches and enable skill gap analysis.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-600 cursor-pointer"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add your skills (e.g. React, Python, Data Analytics)..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#0F766E]"
              />
              <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>

          {/* Resume status quick banner */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900 dark:text-white">
                  {user.resumeFileName ? `Resume: ${user.resumeFileName}` : 'No resume uploaded yet'}
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                  {user.resumeFileName
                    ? 'Resume uploaded. Check or scan in Resume Builder.'
                    : 'Upload your resume to complete your profile and calculate readiness score.'}
                </p>
              </div>
            </div>
            <Link to="/resume">
              <Button variant="outline" size="sm">
                {user.resumeFileName ? 'Manage Resume' : 'Upload Resume'}
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-right">
            <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />} type="submit" className="bg-[#0F766E] hover:bg-[#0D655E]">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
