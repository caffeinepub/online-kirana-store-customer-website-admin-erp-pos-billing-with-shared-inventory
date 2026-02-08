import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductUnit, Supplier, InventoryEntry, StaffAccount, CustomerAccount, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Customer Registration
export function useRegisterCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: CustomerAccount) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCustomer(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myCustomerAccount'] });
    },
  });
}

export function useGetMyCustomerAccount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerAccount | null>({
    queryKey: ['myCustomerAccount'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyCustomerAccount();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Product Queries
export function useGetProductUnits() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductUnit[]>({
    queryKey: ['productUnits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductUnits();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Refetch every 10 seconds for near-real-time updates
  });
}

export function useAddProductUnit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productUnit: ProductUnit) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProductUnit(productUnit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productUnits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Supplier Queries
export function useGetSuppliers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuppliers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplier: Supplier) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSupplier(supplier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

// Inventory Queries
export function useGetInventory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InventoryEntry[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInventory();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Refetch every 10 seconds for near-real-time updates
  });
}

export function useAddInventoryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: InventoryEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addInventoryEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Staff Queries
export function useGetStaffAccounts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StaffAccount[]>({
    queryKey: ['staffAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaffAccounts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRegisterStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staff, principal }: { staff: StaffAccount; principal: string }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.registerStaff(staff, Principal.fromText(principal));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAccounts'] });
    },
  });
}

// Customer Accounts (Admin only)
export function useGetCustomerAccounts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerAccount[]>({
    queryKey: ['customerAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerAccounts();
    },
    enabled: !!actor && !actorFetching,
  });
}
