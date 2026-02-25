import React from 'react';
import { motion } from 'framer-motion';
import EmployeeCard from './EmployeeCard';
import {
  colors,
  departmentContainerStyles,
  spacing,
  typography,
  radius,
} from '../styles/theme';
import type { Department, Employee } from '../types';

// Map department icon strings to emoji fallbacks
const iconMap: Record<string, string> = {
  microscope: '\u{1F52C}',
  code: '\u{1F4BB}',
  'file-text': '\u{1F4DD}',
  palette: '\u{1F3A8}',
  package: '\u{1F4E6}',
  'trending-up': '\u{1F4C8}',
  users: '\u{1F465}',
  brain: '\u{1F9E0}',
  globe: '\u{1F310}',
  settings: '\u{2699}',
};

interface DepartmentGroupProps {
  department: Department;
  onChat: (employee: Employee) => void;
}

const DepartmentGroup: React.FC<DepartmentGroupProps> = ({ department, onChat }) => {
  const iconEmoji = iconMap[department.icon] ?? '\u{1F4C1}';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={departmentContainerStyles}
    >
      {/* Department header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.sm,
        }}
      >
        <span style={{ fontSize: '18px' }}>{iconEmoji}</span>
        <span
          style={{
            ...typography.h3,
            color: department.color,
            letterSpacing: '0.01em',
          }}
        >
          {department.name}
        </span>
        <span
          style={{
            ...typography.tiny,
            marginLeft: 'auto',
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: `2px ${spacing.sm}`,
            borderRadius: radius.full,
            color: colors.textMuted,
          }}
        >
          {department.employees.length} member{department.employees.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Department head badge (if any) */}
      {department.head && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: radius.sm,
            backgroundColor: `${department.color}10`,
            border: `1px solid ${department.color}25`,
            marginBottom: spacing.xs,
          }}
        >
          <span style={{ fontSize: '10px', color: department.color, fontWeight: 600, fontFamily: typography.fontFamily }}>
            HEAD
          </span>
          <span style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: typography.fontFamily }}>
            {department.head.name}
          </span>
        </div>
      )}

      {/* Employee cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {department.employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} onChat={onChat} />
        ))}
        {department.employees.length === 0 && (
          <div
            style={{
              ...typography.body,
              color: colors.textMuted,
              textAlign: 'center',
              padding: spacing.xl,
            }}
          >
            No members yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DepartmentGroup;
