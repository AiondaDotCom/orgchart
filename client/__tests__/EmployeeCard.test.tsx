import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmployeeCard from '../src/components/EmployeeCard';
import type { Employee } from '../src/types';

// Mock framer-motion to avoid animation complexities in tests
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
    span: React.forwardRef(({ children, style, ...rest }: any, ref: any) => (
      <span ref={ref} style={style} data-testid="motion-span" {...rest}>
        {children}
      </span>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  MessageCircle: () => <span data-testid="icon-message-circle">chat</span>,
  Bot: () => <span data-testid="icon-bot">bot</span>,
  User: () => <span data-testid="icon-user">user</span>,
}));

const createMockEmployee = (overrides: Partial<Employee> = {}): Employee => ({
  id: 'emp-test',
  name: 'Test Employee',
  initials: 'TE',
  title: 'Test Engineer',
  type: 'ai',
  departmentId: 'dept-test',
  managerId: null,
  matrixUserId: null,
  avatarColor: '#6366f1',
  skills: ['Testing', 'Debugging', 'Automation'],
  status: 'online',
  isCouncilMember: false,
  councilRole: null,
  description: 'A test employee',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('EmployeeCard', () => {
  it('renders employee name and title', () => {
    const employee = createMockEmployee();
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('Test Employee')).toBeInTheDocument();
    expect(screen.getByText('Test Engineer')).toBeInTheDocument();
  });

  it('renders employee initials in avatar', () => {
    const employee = createMockEmployee({ initials: 'XY' });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('XY')).toBeInTheDocument();
  });

  it('renders skill badges', () => {
    const employee = createMockEmployee({
      skills: ['React', 'TypeScript', 'GraphQL'],
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
  });

  it('renders AI badge for AI employees', () => {
    const employee = createMockEmployee({ type: 'ai' });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByTestId('icon-bot')).toBeInTheDocument();
  });

  it('renders Human badge for human employees', () => {
    const employee = createMockEmployee({ type: 'human' });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
  });

  it('renders chat icon (MessageCircle)', () => {
    const employee = createMockEmployee();
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByTestId('icon-message-circle')).toBeInTheDocument();
  });

  it('calls onChat with employee when chat button is clicked', () => {
    const employee = createMockEmployee();
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    // Find the chat button (motion button with message circle icon)
    const chatButtons = screen.getAllByTestId('motion-button');
    const chatButton = chatButtons.find((btn) =>
      btn.querySelector('[data-testid="icon-message-circle"]')
    );

    expect(chatButton).toBeDefined();
    fireEvent.click(chatButton!);

    expect(onChat).toHaveBeenCalledWith(employee);
  });

  it('calls onChat when card is clicked', () => {
    const employee = createMockEmployee();
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    // Click the card container (the first motion.div)
    const cards = screen.getAllByTestId('motion-div');
    fireEvent.click(cards[0]);

    expect(onChat).toHaveBeenCalledWith(employee);
  });

  it('does not render skills when skills array is empty', () => {
    const employee = createMockEmployee({ skills: [] });
    const onChat = vi.fn();

    const { container } = render(
      <EmployeeCard employee={employee} onChat={onChat} />
    );

    // There should be no skill badge elements
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.queryByText('Testing')).not.toBeInTheDocument();
  });

  it('renders council role badge for council members', () => {
    const employee = createMockEmployee({
      isCouncilMember: true,
      councilRole: 'Growth Advisor',
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.getByText('Growth Advisor')).toBeInTheDocument();
  });

  it('does not render council role badge for non-council members', () => {
    const employee = createMockEmployee({
      isCouncilMember: false,
      councilRole: null,
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(screen.queryByText('Growth Advisor')).not.toBeInTheDocument();
  });

  it('truncates skills list to 4 items in normal mode', () => {
    const employee = createMockEmployee({
      skills: ['A', 'B', 'C', 'D', 'E', 'F'],
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    // Should show first 4 skills and a "+2" badge
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows more skills in large mode', () => {
    const employee = createMockEmployee({
      skills: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} large />);

    // In large mode, shows up to 6 skills plus overflow
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows description in large mode', () => {
    const employee = createMockEmployee({
      description: 'A detailed description here',
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} large />);

    expect(screen.getByText('A detailed description here')).toBeInTheDocument();
  });

  it('does not show description in non-large mode', () => {
    const employee = createMockEmployee({
      description: 'A detailed description here',
    });
    const onChat = vi.fn();

    render(<EmployeeCard employee={employee} onChat={onChat} />);

    expect(
      screen.queryByText('A detailed description here')
    ).not.toBeInTheDocument();
  });
});
