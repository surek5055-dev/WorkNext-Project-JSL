import React from 'react';
import { motion } from 'motion/react';
import { Mentor } from '../../types';
import { Button } from '../ui/Button';
import { Star, Calendar, CheckCircle, Award } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onBook?: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="p-6 rounded-[20px] bg-white dark:bg-[#1A1A1A] border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full group relative overflow-hidden"
    >
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {mentor.avatar ? (
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-base font-bold text-[#0F766E] dark:text-teal-400 group-hover:scale-105 transition-transform">
                {mentor.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <CheckCircle className="w-4 h-4 text-[#0F766E] dark:text-teal-400 fill-white dark:fill-stone-900 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base font-display">{mentor.name}</h3>
            <p className="text-xs text-[#0F766E] dark:text-teal-400 font-semibold font-sans mt-0.5">{mentor.role}</p>
            {mentor.company && (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">{mentor.company}</p>
            )}
            
            {mentor.rating !== undefined && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-500 font-sans font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{mentor.rating}</span>
                {mentor.reviewCount !== undefined && (
                  <span className="text-stone-400 font-normal">({mentor.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {mentor.bio && (
          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 mb-4 leading-relaxed font-sans font-normal">
            {mentor.bio}
          </p>
        )}

        {/* Specialties */}
        {mentor.specialties && mentor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 font-sans">
            {mentor.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info & Booking */}
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-4 font-sans">
          {mentor.sessionsCompleted !== undefined ? (
            <span className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
              <Award className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" /> {mentor.sessionsCompleted} sessions
            </span>
          ) : (
            <span className="text-stone-400 dark:text-stone-500 text-[11px] font-sans">
              Verified Mentor
            </span>
          )}
          {mentor.hourlyRate && (
            <span className="font-extrabold text-[#0F766E] dark:text-teal-400 text-sm font-display">{mentor.hourlyRate}</span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          icon={<Calendar className="w-3.5 h-3.5" />}
          onClick={() => onBook && onBook(mentor)}
          className="bg-[#0F766E] hover:bg-[#0D655E]"
        >
          Book Session
        </Button>
      </div>
    </motion.div>
  );
};
