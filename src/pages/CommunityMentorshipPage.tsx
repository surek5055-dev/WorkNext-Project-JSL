import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { mockMentors } from '../data/mockData';
import { Mentor } from '../types';
import { MentorCard } from '../components/cards/MentorCard';
import { PlaceholderCard } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Calendar, CheckCircle2, MessageSquare, X, Sparkles } from 'lucide-react';

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  repliesCount: number;
  category: string;
}

export interface CommunityMentorshipPageProps {
  mentors?: Mentor[];
  posts?: CommunityPost[];
  onBookSession?: (mentorId: string, topic: string) => void;
}

export const CommunityMentorshipPage: React.FC<CommunityMentorshipPageProps> = ({
  mentors: initialMentors,
  posts: initialPosts,
  onBookSession
}) => {
  const mentors = initialMentors || [];
  const [postsList, setPostsList] = useState<CommunityPost[]>(initialPosts || []);
  const [newPostModal, setNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career Advice');

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookedAlert, setBookedAlert] = useState(false);

  const specialties = [
    'AI Career Transition',
    'Resume Optimization',
    'Technical Interviews',
    'Salary Negotiation',
    'Portfolio Reviews'
  ];

  const filteredMentors = selectedSpecialty
    ? mentors.filter(m => m.specialties.includes(selectedSpecialty))
    : mentors;

  const handleBookConfirm = () => {
    if (selectedMentor && onBookSession) {
      onBookSession(selectedMentor.id, 'Resume Audit & ATS Keywords');
    }
    setBookedAlert(true);
    setSelectedMentor(null);
    setTimeout(() => setBookedAlert(false), 4000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const post: CommunityPost = {
      id: 'post_' + Date.now(),
      title: newTitle.trim(),
      author: 'You',
      repliesCount: 0,
      category: newCategory
    };
    setPostsList([post, ...postsList]);
    setNewTitle('');
    setNewPostModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 text-xs font-semibold text-[#0F766E] dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-teal-400" />
              1-on-1 Career Coaching & Peer Forum
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-2 font-display">
              Community & Mentorship
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-sans">
              Connect with vetted industry leaders for resume audits, mock interviews, and peer feedback.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => setNewPostModal(true)}
            className="bg-[#0F766E] hover:bg-[#0D655E]"
          >
            Start Discussion
          </Button>
        </div>

        <AnimatePresence>
          {bookedAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs flex items-center justify-between font-sans font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400 shrink-0" />
                <span>Mentorship session request submitted! Your mentor will confirm calendar invite via email.</span>
              </div>
              <span className="font-bold cursor-pointer hover:opacity-80" onClick={() => setBookedAlert(false)}>✕</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 font-sans">
          <button
            onClick={() => setSelectedSpecialty('')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSpecialty === ''
                ? 'bg-[#0F766E] text-white shadow-xs border border-teal-600'
                : 'bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Mentors ({filteredMentors.length})
          </button>
          {specialties.map((spec, i) => (
            <button
              key={i}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-[#0F766E] text-white shadow-xs border border-teal-600'
                  : 'bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Mentor Cards Grid */}
        {filteredMentors.length === 0 ? (
          <PlaceholderCard
            title="Career Mentors"
            placeholderText="No mentors loaded yet."
            description="Verified career coaches and industry mentors will appear here as the mentorship network expands."
            icon={<Calendar className="w-6 h-6" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(m => (
              <div key={m.id} className="relative">
                <MentorCard mentor={m} onBook={men => setSelectedMentor(men)} />
              </div>
            ))}
          </div>
        )}

        {/* Community Discussion Board Section */}
        <div className="p-8 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2.5 font-display">
              <MessageSquare className="w-5 h-5 text-[#0F766E] dark:text-teal-400" /> Community Discussions
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => setNewPostModal(true)}
            >
              Ask Question
            </Button>
          </div>

          {postsList.length === 0 ? (
            <PlaceholderCard
              title="Community Forum"
              placeholderText="No community posts yet."
              description="Join discussions, share job search tips, or ask questions to fellow job seekers and mentors."
              icon={<MessageSquare className="w-6 h-6" />}
              actionText="Start First Discussion"
              onAction={() => setNewPostModal(true)}
            />
          ) : (
            <div className="space-y-3 font-sans">
              {postsList.map(post => (
                <div key={post.id} className="p-5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white font-display">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans mt-1">
                      Posted by {post.author} • {post.repliesCount} replies
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                      {post.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Discussion Modal */}
        <AnimatePresence>
          {newPostModal && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-lg w-full max-w-md p-8 space-y-6 text-stone-900 dark:text-white"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 font-display">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Start a Discussion</h3>
                  <button onClick={() => setNewPostModal(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold">Discussion Topic / Question</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tips for preparing for tech system design rounds?"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Career Advice">Career Advice</option>
                      <option value="Resume Tips">Resume Tips</option>
                      <option value="Interview Prep">Interview Prep</option>
                      <option value="Salary Negotiation">Salary Negotiation</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
                    <Button variant="outline" size="sm" type="button" onClick={() => setNewPostModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" className="bg-[#0F766E] hover:bg-[#0D655E]">
                      Post Topic
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {selectedMentor && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-[20px] shadow-lg w-full max-w-md p-8 space-y-6 text-stone-900 dark:text-white"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 font-display">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Book Mentorship Session</h3>
                  <button onClick={() => setSelectedMentor(null)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3.5 font-sans">
                  <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-800" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">{selectedMentor.name}</h4>
                    <p className="text-xs text-[#0F766E] dark:text-teal-400 font-semibold">{selectedMentor.role}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold">Session Focus</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-[#0F766E]">
                      <option>Resume Audit & ATS Keywords</option>
                      <option>Mock Technical Interview</option>
                      <option>Salary Negotiation Strategy</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold font-sans">Next Available Slot</label>
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                      {selectedMentor.availability}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 font-sans">
                  <Button variant="outline" size="sm" onClick={() => setSelectedMentor(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleBookConfirm} className="bg-[#0F766E] hover:bg-[#0D655E]">
                    Confirm Session
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

