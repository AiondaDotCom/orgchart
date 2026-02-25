import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, User } from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import {
  colors,
  cardStyles,
  avatarStyles,
  skillBadgeStyles,
  typeBadgeAI,
  typeBadgeHuman,
  spacing,
  radius,
  typography,
  shadows,
} from '../styles/theme';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onChat: (employee: Employee) => void;
  large?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onChat, large = false }) => {
  const avatarSize = large ? 56 : 42;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: shadows.cardHover,
      }}
      transition={{ duration: 0.2 }}
      style={{
        ...cardStyles,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        padding: large ? spacing.xl : spacing.lg,
        position: 'relative',
      }}
      onClick={() => onChat(employee)}
    >
      {/* Top row: Avatar + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={avatarStyles(avatarSize, employee.avatarColor)}>
            {employee.initials}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: colors.bgCard,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StatusIndicator status={employee.status} size={8} />
          </div>
        </div>

        {/* Name + title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              ...typography.h3,
              fontSize: large ? '16px' : '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {employee.name}
          </div>
          <div
            style={{
              ...typography.caption,
              color: colors.textSecondary,
              fontSize: large ? '13px' : '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {employee.title}
          </div>
        </div>

        {/* Type badge + chat icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={employee.type === 'ai' ? typeBadgeAI : typeBadgeHuman}>
            {employee.type === 'ai' ? (
              <Bot size={11} />
            ) : (
              <User size={11} />
            )}
            {employee.type === 'ai' ? 'AI' : 'Human'}
          </span>
          <motion.button
            whileHover={{ scale: 1.15, color: colors.teal }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChat(employee);
            }}
          >
            <MessageCircle size={16} />
          </motion.button>
        </div>
      </div>

      {/* Description (if available and large mode) */}
      {large && employee.description && (
        <div
          style={{
            ...typography.body,
            color: colors.textMuted,
            fontSize: '12px',
            lineHeight: '18px',
          }}
        >
          {employee.description}
        </div>
      )}

      {/* Skills */}
      {employee.skills.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {employee.skills.slice(0, large ? 6 : 4).map((skill) => (
            <span key={skill} style={skillBadgeStyles}>
              {skill}
            </span>
          ))}
          {employee.skills.length > (large ? 6 : 4) && (
            <span
              style={{
                ...skillBadgeStyles,
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              +{employee.skills.length - (large ? 6 : 4)}
            </span>
          )}
        </div>
      )}

      {/* Council role badge */}
      {employee.isCouncilMember && employee.councilRole && (
        <div
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            padding: `2px ${spacing.sm}`,
            borderRadius: radius.full,
            backgroundColor: 'rgba(249,115,22,0.12)',
            color: '#FB923C',
            border: '1px solid rgba(249,115,22,0.25)',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: typography.fontFamily,
          }}
        >
          {employee.councilRole}
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeCard;
