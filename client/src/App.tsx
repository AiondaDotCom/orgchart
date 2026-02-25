import React, { useEffect } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import OrgChart from './components/OrgChart';
import { globalBodyStyles } from './styles/theme';

// ── Apollo Links ─────────────────────────────────────────────────
const httpLink = new HttpLink({
  uri: '/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${window.location.hostname}:4000/graphql`,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// ── Apollo Client ────────────────────────────────────────────────
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Employee: {
        fields: {
          skills: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          directReports: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Department: {
        fields: {
          employees: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

// ── App Component ────────────────────────────────────────────────
const App: React.FC = () => {
  // Apply global styles to body
  useEffect(() => {
    const body = document.body;
    Object.assign(body.style, globalBodyStyles);

    // Also ensure html has the same background
    const html = document.documentElement;
    html.style.backgroundColor = globalBodyStyles.backgroundColor as string;
    html.style.margin = '0';
    html.style.padding = '0';

    // Global scrollbar styles (via a style element)
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #252836; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #353848; }
      ::selection { background: rgba(42,181,178,0.3); }
      input:focus, select:focus, textarea:focus {
        border-color: #2AB5B2 !important;
        outline: none;
      }
      option { background: #151823; color: #F0F0F5; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <ApolloProvider client={client}>
      <OrgChart />
    </ApolloProvider>
  );
};

export default App;
