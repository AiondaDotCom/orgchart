import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@apollo/client';
import { X, UserPlus } from 'lucide-react';
import { CREATE_EMPLOYEE } from '../graphql/mutations';
import { GET_DEPARTMENTS, GET_ORG_CHART } from '../graphql/queries';
import {
  colors,
  modalOverlayStyles,
  modalContentStyles,
  inputStyles,
  selectStyles,
  labelStyles,
  buttonPrimaryStyles,
  buttonSecondaryStyles,
  spacing,
  typography,
  radius,
} from '../styles/theme';
import type { Department } from '../types';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

interface DepartmentsData {
  departments: Department[];
}

const avatarColorOptions = [
  '#2AB5B2', '#6366F1', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#3B82F6', '#10B981',
];

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'human' | 'ai'>('ai');
  const [departmentId, setDepartmentId] = useState('');
  const [skills, setSkills] = useState('');
  const [matrixUserId, setMatrixUserId] = useState('');
  const [avatarColor, setAvatarColor] = useState(avatarColorOptions[0]);
  const [isCouncilMember, setIsCouncilMember] = useState(false);
  const [councilRole, setCouncilRole] = useState('');
  const [description, setDescription] = useState('');

  const { data: deptData } = useQuery<DepartmentsData>(GET_DEPARTMENTS);

  const [createEmployee, { loading }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_ORG_CHART }],
    onCompleted: () => {
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setName('');
    setTitle('');
    setType('ai');
    setDepartmentId('');
    setSkills('');
    setMatrixUserId('');
    setAvatarColor(avatarColorOptions[0]);
    setIsCouncilMember(false);
    setCouncilRole('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createEmployee({
      variables: {
        input: {
          name: name.trim(),
          title: title.trim(),
          type,
          departmentId: departmentId || undefined,
          skills: skillsArray.length > 0 ? skillsArray : undefined,
          matrixUserId: matrixUserId.trim() || undefined,
          avatarColor,
          isCouncilMember,
          councilRole: councilRole.trim() || undefined,
          description: description.trim() || undefined,
        },
      },
    });
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={modalOverlayStyles}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={modalContentStyles}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.xl,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: radius.md,
                    backgroundColor: 'rgba(42,181,178,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.teal,
                  }}
                >
                  <UserPlus size={20} />
                </div>
                <div>
                  <div style={typography.h2}>Add Employee</div>
                  <div style={{ ...typography.caption, color: colors.textMuted }}>
                    Add a new team member to the org chart
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name + Title row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyles}>Name *</label>
                  <input
                    style={inputStyles}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. NEXUS"
                    required
                  />
                </div>
                <div style={fieldGroupStyle}>
                  <label style={labelStyles}>Title *</label>
                  <input
                    style={inputStyles}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Research Lead"
                    required
                  />
                </div>
              </div>

              {/* Type + Department row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyles}>Type *</label>
                  <select
                    style={selectStyles}
                    value={type}
                    onChange={(e) => setType(e.target.value as 'human' | 'ai')}
                  >
                    <option value="ai">AI Agent</option>
                    <option value="human">Human</option>
                  </select>
                </div>
                <div style={fieldGroupStyle}>
                  <label style={labelStyles}>Department</label>
                  <select
                    style={selectStyles}
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {deptData?.departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div style={fieldGroupStyle}>
                <label style={labelStyles}>Skills (comma-separated)</label>
                <input
                  style={inputStyles}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. NLP, Data Analysis, Python"
                />
              </div>

              {/* Matrix User ID */}
              <div style={fieldGroupStyle}>
                <label style={labelStyles}>Matrix User ID</label>
                <input
                  style={inputStyles}
                  value={matrixUserId}
                  onChange={(e) => setMatrixUserId(e.target.value)}
                  placeholder="e.g. @nexus:aionda.com"
                />
              </div>

              {/* Description */}
              <div style={fieldGroupStyle}>
                <label style={labelStyles}>Description</label>
                <textarea
                  style={{
                    ...inputStyles,
                    minHeight: '60px',
                    resize: 'vertical',
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of role and capabilities"
                />
              </div>

              {/* Council membership */}
              <div style={{ ...fieldGroupStyle, display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    cursor: 'pointer',
                    color: colors.textSecondary,
                    fontSize: '13px',
                    fontFamily: typography.fontFamily,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isCouncilMember}
                    onChange={(e) => setIsCouncilMember(e.target.checked)}
                    style={{ accentColor: colors.teal }}
                  />
                  Council Member
                </label>
                {isCouncilMember && (
                  <input
                    style={{ ...inputStyles, flex: 1 }}
                    value={councilRole}
                    onChange={(e) => setCouncilRole(e.target.value)}
                    placeholder="Council role"
                  />
                )}
              </div>

              {/* Avatar color */}
              <div style={fieldGroupStyle}>
                <label style={labelStyles}>Avatar Color</label>
                <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                  {avatarColorOptions.map((clr) => (
                    <motion.button
                      type="button"
                      key={clr}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAvatarColor(clr)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: radius.full,
                        backgroundColor: clr,
                        border: avatarColor === clr
                          ? `2px solid ${colors.white}`
                          : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        outline: avatarColor === clr
                          ? `2px solid ${clr}`
                          : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: spacing.md,
                  marginTop: spacing.xl,
                  paddingTop: spacing.lg,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <button
                  type="button"
                  style={buttonSecondaryStyles}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonPrimaryStyles,
                    opacity: loading || !name.trim() || !title.trim() ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto',
                  }}
                  disabled={loading || !name.trim() || !title.trim()}
                >
                  {loading ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEmployeeModal;
