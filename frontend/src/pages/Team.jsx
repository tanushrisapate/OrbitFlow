import React, { useState, useEffect } from 'react';
import { Plus, Mail, Shield, UserX, AlertCircle, RefreshCw } from 'lucide-react';
import { getMembers, inviteMember, updateMemberRole, removeMember } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

export default function Team() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const { addToast } = useToast();

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMembers();
      setMemberList(res.data);
    } catch (err) {
      console.error('Failed to load team members from API:', err);
      setError('Unable to load team members from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      const res = await inviteMember(1, inviteEmail, inviteRole);
      setMemberList(prev => [...prev, res.data]);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteRole('Member');
      addToast('success', 'Member invited successfully!');
    } catch (err) {
      console.error('Failed to invite member:', err);
      addToast('error', 'Failed to invite member');
    }
  };

  const handleUpdateRole = async (member, newRole) => {
    try {
      const res = await updateMemberRole(1, member.user_id || member.id, newRole);
      setMemberList(prev => prev.map(m => (m.user_id === member.user_id || m.id === member.id) ? res.data : m));
      addToast('success', `Role updated to ${newRole}`);
    } catch (err) {
      console.error('Failed to update role:', err);
      addToast('error', 'Failed to update role');
    }
  };

  const handleRemove = async (member) => {
    if (!window.confirm(`Are you sure you want to remove ${member.name || member.email}?`)) return;

    try {
      await removeMember(1, member.user_id || member.id);
      setMemberList(prev => prev.filter(m => (m.user_id || m.id) !== (member.user_id || member.id)));
      addToast('success', 'Member removed successfully!');
    } catch (err) {
      console.error('Failed to remove member:', err);
      addToast('error', 'Failed to remove member');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">Manage workspace collaborators and access roles</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {error ? (
        <div className="card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Failed to load team</h3>
          <p className="text-sm text-surface-500 mb-6">{error}</p>
          <button onClick={fetchTeamMembers} className="btn btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : memberList.length === 0 ? (
        <EmptyState
          type="team"
          title="No Team Members"
          description="There are no team members listed in the database. Invite your first team member!"
          action={{
            label: 'Invite Member',
            onClick: () => setIsInviteModalOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberList.map((member) => (
            <div key={member.id || member.user_id} className="card p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name || member.email} size="md" />
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white text-base">{member.name}</h3>
                    <p className="text-xs text-surface-500">{member.email}</p>
                  </div>
                </div>
                <Badge variant={member.role === 'Owner' || member.role === 'Admin' ? 'primary' : 'default'}>
                  {member.role}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800 text-xs">
                <select
                  value={member.role}
                  onChange={(e) => handleUpdateRole(member, e.target.value)}
                  className="input text-xs py-1 px-2"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Lead">Lead</option>
                </select>

                <button
                  onClick={() => handleRemove(member)}
                  className="text-surface-400 hover:text-red-600 p-1.5 rounded transition-colors"
                  title="Remove Member"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="colleague@devtrack.io"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="input w-full text-sm"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsInviteModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Send Invitation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
