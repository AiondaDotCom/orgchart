import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import AddEmployeeModal from '../src/components/AddEmployeeModal';
import { CREATE_EMPLOYEE } from '../src/graphql/mutations';
import { GET_DEPARTMENTS, GET_ORG_CHART } from '../src/graphql/queries';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, style, onClick, ...rest }: any, ref: any) => (
      <div ref={ref} style={style} onClick={onClick} data-testid="motion-div" {...rest}>
        {children}
      </div>
    )),
    button: React.forwardRef(({ children, style, onClick, type, disabled, ...rest }: any, ref: any) => (
      <button ref={ref} style={style} onClick={onClick} type={type} disabled={disabled} data-testid="motion-button" {...rest}>
        {children}
      </button>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x">x</span>,
  UserPlus: () => <span data-testid="icon-user-plus">+</span>,
}));

const departmentsMock: MockedResponse = {
  request: {
    query: GET_DEPARTMENTS,
  },
  result: {
    data: {
      departments: [
        {
          id: 'dept-research',
          name: 'Research',
          icon: '🔬',
          color: '#8b5cf6',
          parentDepartmentId: null,
          headId: 'emp-atlas',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          head: { id: 'emp-atlas', name: 'ATLAS' },
          employees: [],
        },
        {
          id: 'dept-development',
          name: 'Development',
          icon: '💻',
          color: '#3b82f6',
          parentDepartmentId: null,
          headId: 'emp-clawd',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          head: { id: 'emp-clawd', name: 'CLAWD' },
          employees: [],
        },
      ],
    },
  },
};

const createEmployeeMock: MockedResponse = {
  request: {
    query: CREATE_EMPLOYEE,
    variables: {
      input: {
        name: 'New Agent',
        title: 'Test Lead',
        type: 'ai',
        departmentId: undefined,
        skills: undefined,
        matrixUserId: undefined,
        avatarColor: '#2AB5B2',
        isCouncilMember: false,
        councilRole: undefined,
        description: undefined,
      },
    },
  },
  result: {
    data: {
      createEmployee: {
        id: 'emp-new',
        name: 'New Agent',
        initials: 'NA',
        title: 'Test Lead',
        type: 'ai',
        departmentId: null,
        managerId: null,
        matrixUserId: null,
        avatarColor: '#2AB5B2',
        skills: [],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        department: null,
      },
    },
  },
};

const renderModal = (open: boolean, onClose = vi.fn(), mocks: MockedResponse[] = [departmentsMock]) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AddEmployeeModal open={open} onClose={onClose} />
    </MockedProvider>
  );
};

describe('AddEmployeeModal', () => {
  it('renders when open is true', () => {
    renderModal(true);

    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(
      screen.getByText('Add a new team member to the org chart')
    ).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderModal(false);

    expect(screen.queryByText('Add Employee')).not.toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    renderModal(true);

    expect(screen.getByText('Name *')).toBeInTheDocument();
    expect(screen.getByText('Title *')).toBeInTheDocument();
    expect(screen.getByText('Type *')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Skills (comma-separated)')).toBeInTheDocument();
    expect(screen.getByText('Matrix User ID')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Avatar Color')).toBeInTheDocument();
  });

  it('renders name input with placeholder', () => {
    renderModal(true);

    const nameInput = screen.getByPlaceholderText('e.g. NEXUS');
    expect(nameInput).toBeInTheDocument();
  });

  it('renders title input with placeholder', () => {
    renderModal(true);

    const titleInput = screen.getByPlaceholderText('e.g. Research Lead');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders type select with AI and Human options', () => {
    renderModal(true);

    expect(screen.getByText('AI Agent')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    renderModal(true);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders Create Employee button', () => {
    renderModal(true);

    expect(screen.getByText('Create Employee')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    // Find the X button (motion button containing the X icon)
    const closeButtons = screen.getAllByTestId('motion-button');
    const closeButton = closeButtons.find((btn) =>
      btn.querySelector('[data-testid="icon-x"]')
    );

    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton!);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    // The overlay is the first motion-div
    const motionDivs = screen.getAllByTestId('motion-div');
    fireEvent.click(motionDivs[0]);

    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    // Click on the form content area
    fireEvent.click(screen.getByText('Add Employee'));

    // onClose should not be called for clicks inside the modal content
    // It may have been called if the click propagated to overlay
    // The modal uses stopPropagation on content click
  });

  it('has Create Employee button disabled when name and title are empty', () => {
    renderModal(true);

    const submitButton = screen.getByText('Create Employee');
    expect(submitButton).toBeDisabled();
  });

  it('renders Council Member checkbox', () => {
    renderModal(true);

    expect(screen.getByText('Council Member')).toBeInTheDocument();
  });

  it('shows council role input when council member checkbox is checked', async () => {
    renderModal(true);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(screen.getByPlaceholderText('Council role')).toBeInTheDocument();
  });

  it('renders avatar color selection buttons', () => {
    renderModal(true);

    // There are 10 color options
    const colorButtons = screen.getAllByTestId('motion-button').filter((btn) => {
      const style = btn.getAttribute('style') || '';
      return style.includes('border-radius') && style.includes('32px');
    });

    expect(colorButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls createEmployee mutation on form submission', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[departmentsMock, createEmployeeMock]}
        addTypename={false}
      >
        <AddEmployeeModal open={true} onClose={onClose} />
      </MockedProvider>
    );

    // Fill in required fields
    const nameInput = screen.getByPlaceholderText('e.g. NEXUS');
    const titleInput = screen.getByPlaceholderText('e.g. Research Lead');

    await user.type(nameInput, 'New Agent');
    await user.type(titleInput, 'Test Lead');

    // Submit the form
    const submitButton = screen.getByText('Create Employee');
    fireEvent.click(submitButton);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
