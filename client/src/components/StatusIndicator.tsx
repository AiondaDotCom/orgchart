import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../styles/theme';
import type { OnlineStatus } from '../types';

interface StatusIndicatorProps {
  status: OnlineStatus;
  size?: number;
}

const statusColorMap: Record<OnlineStatus, string> = {
  online: colors.online,
  offline: colors.offline,
  unavailable: colors.unavailable,
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 10 }) => {
  const color = statusColorMap[status];

  if (status === 'online') {
    return (
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
        }}
      >
        <motion.span
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
        <span
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: color,
            position: 'relative',
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  );
};

export default StatusIndicator;
