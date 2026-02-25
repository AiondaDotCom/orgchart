import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock the Apollo Client module to avoid network connections
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    ApolloProvider: ({ children }: any) => <>{children}</>,
    ApolloClient: vi.fn().mockImplementation(() => ({
      query: vi.fn(),
      mutate: vi.fn(),
      subscribe: vi.fn(),
      cache: {
        identify: vi.fn(),
        modify: vi.fn(),
      },
    })),
    InMemoryCache: vi.fn().mockImplementation(() => ({})),
    HttpLink: vi.fn().mockImplementation(() => ({})),
    split: vi.fn().mockReturnValue({}),
    useQuery: vi.fn().mockReturnValue({
      data: {
        orgChart: {
          ceo: {
            id: 'emp-vadim',
            name: 'John Doe',
            initials: 'VS',
            title: 'CEO',
            type: 'human',
            departmentId: null,
            managerId: null,
            matrixUserId: null,
            avatarColor: '#6366f1',
            skills: ['Leadership', 'Vision', 'Strategy'],
            status: 'unavailable',
            isCouncilMember: false,
            councilRole: null,
            description: 'Founder & CEO',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            directReports: [],
          },
          council: [],
          departments: [],
          unassigned: [],
        },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useSubscription: vi.fn().mockReturnValue({ data: null }),
    useMutation: vi.fn().mockReturnValue([vi.fn(), { loading: false }]),
    gql: (strings: TemplateStringsArray, ...values: any[]) => {
      return strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
    },
  };
});

// Mock @apollo/client/link/subscriptions
vi.mock('@apollo/client/link/subscriptions', () => ({
  GraphQLWsLink: vi.fn().mockImplementation(() => ({})),
}));

// Mock @apollo/client/utilities
vi.mock('@apollo/client/utilities', () => ({
  getMainDefinition: vi.fn(),
}));

// Mock graphql-ws
vi.mock('graphql-ws', () => ({
  createClient: vi.fn().mockReturnValue({}),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, style, onClick, ...rest }: any, ref: any) => (
      <div ref={ref} style={style} onClick={onClick} data-testid="motion-div" {...rest}>
        {children}
      </div>
    )),
    button: React.forwardRef(({ children, style, onClick, ...rest }: any, ref: any) => (
      <button ref={ref} style={style} onClick={onClick} data-testid="motion-button" {...rest}>
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

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus">+</span>,
  Loader2: () => <span data-testid="icon-loader">loading</span>,
  AlertTriangle: () => <span data-testid="icon-alert">alert</span>,
  Shield: () => <span data-testid="icon-shield">shield</span>,
  MessageCircle: () => <span data-testid="icon-message-circle">chat</span>,
  Bot: () => <span data-testid="icon-bot">bot</span>,
  User: () => <span data-testid="icon-user">user</span>,
  X: () => <span data-testid="icon-x">x</span>,
  UserPlus: () => <span data-testid="icon-user-plus">+</span>,
  Send: () => <span data-testid="icon-send">send</span>,
}));

// Mock ChatPanel since it may or may not exist yet
vi.mock('../src/components/ChatPanel', () => ({
  default: ({ employee, onClose }: any) =>
    employee ? (
      <div data-testid="chat-panel">
        Chat with {employee.name}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('App', () => {
  it('renders without crashing', async () => {
    const { default: App } = await import('../src/App');

    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the Aionda logo', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    const logo = screen.getByAltText('Aionda');
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute('src')).toBe('/logo.png');
  });

  it('renders OrgChart heading', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByText('OrgChart')).toBeInTheDocument();
  });

  it('renders "AI Workforce Management" subtitle', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByText('AI Workforce Management')).toBeInTheDocument();
  });

  it('renders CEO card when data is loaded', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });

  it('renders CHIEF EXECUTIVE label', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByText('CHIEF EXECUTIVE')).toBeInTheDocument();
  });

  it('renders the add employee FAB button', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByTestId('icon-plus')).toBeInTheDocument();
  });

  it('renders Members count', async () => {
    const { default: App } = await import('../src/App');

    render(<App />);

    expect(screen.getByText('Members')).toBeInTheDocument();
  });
});
