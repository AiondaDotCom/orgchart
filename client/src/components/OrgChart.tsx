import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { useOrgChart } from '../hooks/useOrgChart';
import EmployeeCard from './EmployeeCard';
import DepartmentGroup from './DepartmentGroup';
import AddEmployeeModal from './AddEmployeeModal';
import ChatPanel from './ChatPanel';
import {
  colors,
  spacing,
  typography,
  radius,
  fabStyles,
  shadows,
} from '../styles/theme';
import type { Employee } from '../types';

const OrgChart: React.FC = () => {
  const { orgChart, loading, error } = useOrgChart();
  const [chatEmployee, setChatEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleChat = (employee: Employee) => {
    setChatEmployee(employee);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          backgroundColor: colors.bgPrimary,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={40} style={{ color: colors.teal }} />
        </motion.div>
        <div style={{ ...typography.body, color: colors.textMuted }}>
          Loading org chart...
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          backgroundColor: colors.bgPrimary,
        }}
      >
        <AlertTriangle size={40} style={{ color: colors.danger }} />
        <div style={{ ...typography.h3, color: colors.danger }}>
          Failed to load org chart
        </div>
        <div style={{ ...typography.body, color: colors.textMuted, maxWidth: '400px', textAlign: 'center' }}>
          {error.message}
        </div>
      </div>
    );
  }

  if (!orgChart) return null;

  const { ceo, council, departments, unassigned } = orgChart;

  // Find special employees in ceo's direct reports or unassigned
  // JARVIS = Chief Strategy Officer, ORACLE = consultant
  // We derive them from the data rather than hardcoding IDs
  const allEmployees = [
    ...(ceo ? [ceo] : []),
    ...council,
    ...departments.flatMap((d) => d.employees),
    ...unassigned,
  ];

  // Filter council for display (excluding CEO)
  const councilForDisplay = council.filter((c) => c.id !== ceo?.id);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPrimary,
        paddingBottom: '100px',
      }}
    >
      {/* ═══ HEADER ═══ */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing.lg} ${spacing.xxl}`,
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.bgSurface,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <img
            src="/logo.png"
            alt="Aionda"
            style={{ height: '32px', width: 'auto' }}
          />
          <div>
            <div style={{ ...typography.h2, fontSize: '18px', letterSpacing: '-0.01em' }}>
              OrgChart
            </div>
            <div style={{ ...typography.caption, color: colors.textMuted, fontSize: '11px' }}>
              AI Workforce Management
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
          <div
            style={{
              ...typography.caption,
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <span style={{ color: colors.teal, fontWeight: 600 }}>
              {allEmployees.length}
            </span>{' '}
            Members
          </div>
        </div>
      </header>

      {/* ═══ HIERARCHY SECTION ═══ */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `${spacing.xxxl} ${spacing.xxl}`,
        }}
      >
        {/* --- CEO --- */}
        {ceo && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: spacing.xxl }}>
            <div
              style={{
                ...typography.tiny,
                color: colors.teal,
                marginBottom: spacing.sm,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Shield size={12} />
              CHIEF EXECUTIVE
            </div>
            <div style={{ width: '340px', maxWidth: '100%' }}>
              <EmployeeCard employee={ceo} onChat={handleChat} large />
            </div>

            {/* Vertical line from CEO */}
            <div
              style={{
                width: '2px',
                height: '32px',
                backgroundColor: colors.border,
                marginTop: spacing.sm,
              }}
            />
          </div>
        )}

        {/* --- Horizontal connector --- */}
        {(councilForDisplay.length > 0 || unassigned.length > 0) && (
          <div style={{ position: 'relative', marginBottom: spacing.xxl }}>
            {/* Horizontal line */}
            <div
              style={{
                width: '60%',
                height: '2px',
                backgroundColor: colors.border,
                margin: '0 auto',
              }}
            />

            {/* Council + Key reports row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.xxl,
                flexWrap: 'wrap',
                paddingTop: spacing.xl,
              }}
            >
              {/* Council box */}
              {councilForDisplay.length > 0 && (
                <div
                  style={{
                    backgroundColor: colors.bgSurface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg,
                    padding: spacing.xl,
                    minWidth: '280px',
                    maxWidth: '360px',
                  }}
                >
                  <div
                    style={{
                      ...typography.tiny,
                      color: '#FB923C',
                      marginBottom: spacing.md,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <Shield size={12} />
                    ADVISORY COUNCIL
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {councilForDisplay.map((member) => (
                      <EmployeeCard
                        key={member.id}
                        employee={member}
                        onChat={handleChat}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Unassigned employees */}
              {unassigned.length > 0 && (
                <div
                  style={{
                    backgroundColor: colors.bgSurface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg,
                    padding: spacing.xl,
                    minWidth: '280px',
                    maxWidth: '360px',
                  }}
                >
                  <div
                    style={{
                      ...typography.tiny,
                      color: colors.textMuted,
                      marginBottom: spacing.md,
                    }}
                  >
                    UNASSIGNED
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {unassigned.map((emp) => (
                      <EmployeeCard
                        key={emp.id}
                        employee={emp}
                        onChat={handleChat}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical line to departments */}
            <div
              style={{
                width: '2px',
                height: '32px',
                backgroundColor: colors.border,
                margin: `${spacing.xl} auto 0`,
              }}
            />
          </div>
        )}

        {/* --- DEPARTMENTS GRID --- */}
        {departments.length > 0 && (
          <div>
            <div
              style={{
                ...typography.tiny,
                color: colors.textMuted,
                textAlign: 'center',
                marginBottom: spacing.xl,
              }}
            >
              DEPARTMENTS
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: spacing.xl,
              }}
            >
              {departments.map((dept) => (
                <DepartmentGroup
                  key={dept.id}
                  department={dept}
                  onChat={handleChat}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ FAB ═══ */}
      <motion.button
        whileHover={{
          scale: 1.1,
          boxShadow: '0 6px 24px rgba(42,181,178,0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          ...fabStyles,
          // Shift left when chat panel is open
          right: chatEmployee ? '412px' : '32px',
          transition: 'right 0.3s ease',
        }}
        onClick={() => setShowAddModal(true)}
      >
        <Plus size={24} />
      </motion.button>

      {/* ═══ MODALS / PANELS ═══ */}
      <AddEmployeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <ChatPanel
        employee={chatEmployee}
        onClose={() => setChatEmployee(null)}
      />
    </div>
  );
};

export default OrgChart;
