import { useQuery, useSubscription } from '@apollo/client';
import { GET_ORG_CHART } from '../graphql/queries';
import {
  EMPLOYEE_STATUS_CHANGED,
  EMPLOYEE_CREATED,
  EMPLOYEE_UPDATED,
  EMPLOYEE_DELETED,
} from '../graphql/subscriptions';
import type { OrgChart, StatusChangeEvent, Employee } from '../types';

interface OrgChartQueryData {
  orgChart: OrgChart;
}

interface StatusChangedData {
  employeeStatusChanged: StatusChangeEvent;
}

interface EmployeeCreatedData {
  employeeCreated: Employee;
}

interface EmployeeUpdatedData {
  employeeUpdated: Employee;
}

interface EmployeeDeletedData {
  employeeDeleted: string;
}

export function useOrgChart() {
  const { data, loading, error, refetch } = useQuery<OrgChartQueryData>(GET_ORG_CHART);

  // Subscribe to real-time status changes
  useSubscription<StatusChangedData>(EMPLOYEE_STATUS_CHANGED, {
    onData: ({ client, data: subscriptionData }) => {
      if (!subscriptionData.data) return;
      const { employeeId, status } = subscriptionData.data.employeeStatusChanged;

      // Update the cache for this employee's status
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Employee', id: employeeId }),
        fields: {
          status() {
            return status;
          },
        },
      });
    },
  });

  // Subscribe to new employees
  useSubscription<EmployeeCreatedData>(EMPLOYEE_CREATED, {
    onData: () => {
      refetch();
    },
  });

  // Subscribe to updated employees
  useSubscription<EmployeeUpdatedData>(EMPLOYEE_UPDATED, {
    onData: () => {
      refetch();
    },
  });

  // Subscribe to deleted employees
  useSubscription<EmployeeDeletedData>(EMPLOYEE_DELETED, {
    onData: () => {
      refetch();
    },
  });

  return {
    orgChart: data?.orgChart ?? null,
    loading,
    error: error ?? null,
    refetch,
  };
}
