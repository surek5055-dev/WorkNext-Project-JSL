import React, { useState } from 'react';
import { ServerUser } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  Ban,
  Mail,
  Calendar,
  Briefcase,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AdminUsersTabProps {
  users: ServerUser[];
  isLoading: boolean;
  onToggleStatus: (userId: string, currentStatus: 'active' | 'suspended', name: string) => Promise<void>;
  actionLoadingId: string | null;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  isLoading,
  onToggleStatus,
  actionLoadingId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'jobseeker' | 'recruiter' | 'admin'>('all');

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchTitle = (u.title || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchTitle;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800">
          {(['all', 'jobseeker', 'recruiter', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterRole === role
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Users Table / List */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-mono">
          Loading user records...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
          <Users className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">No user accounts found.</p>
          <p className="text-xs text-stone-500">
            Try adjusting your search criteria or role filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-800 overflow-hidden bg-stone-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900/90 border-b border-stone-800 text-stone-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Joined</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {filteredUsers.map(u => {
                  const status = u.status || 'active';
                  const isActing = actionLoadingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-stone-850/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs">
                            {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-200 text-xs">
                              {u.name || 'Anonymous User'}
                            </p>
                            <p className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-500" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                              : u.role === 'recruiter'
                              ? 'bg-teal-950/80 border border-teal-800 text-teal-300'
                              : 'bg-stone-800 border border-stone-700 text-stone-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            status === 'active'
                              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                              : 'bg-stone-800 border border-stone-700 text-stone-400'
                          }`}
                        >
                          {status === 'active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Ban className="w-3 h-3" />
                          )}
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-stone-400 font-mono text-[11px]">
                        {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => onToggleStatus(u.id, status, u.name || u.email)}
                            disabled={isActing}
                            className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                              status === 'active'
                                ? 'bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-rose-300 border border-stone-700'
                                : 'bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800'
                            }`}
                          >
                            {status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
