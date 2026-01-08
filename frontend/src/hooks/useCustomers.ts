import { useEffect, useState } from "react";
import { Customer, ICustomerUpdate, ICustomerCreate } from "../models/Customer";
import { 
  fetchAllCustomers, fetchCustomer, createCustomer, 
  updateCustomer, deleteCustomer, fetchCustomerByEmail 
} from "../services/customerServices";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (customers.length === 0) fetchAllCustomersHandler();
  }, []);

  const fetchAllCustomersHandler = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomers();
      setCustomers(data);
    } catch (error) {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchCustomer(id);
      setCustomer(data);
    } catch (error) {
      setError("Error fetching Customer");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerByEmailHandler = async (email: string) => {
    try {
      const data = await fetchCustomerByEmail(email);
      setCustomer(data ?? null);
      return data ?? null;  
    } catch (error) {
      console.error("Error fetching customer by email:", error);
      return null;
    }
  };

const createCustomerHandler = async (payload: ICustomerCreate): Promise<{ customer: Customer | null, error?: string }> => {
  setLoading(true);
  try {
    const newCustomer = await createCustomer(payload);
    setCustomer(newCustomer);
    setCustomers((prev) => [...prev, newCustomer]);
    return { customer: newCustomer };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to create customer";
    setError(message);
    return { customer: null, error: message };
  } finally {
    setLoading(false);
  }
};

  const updateCustomerHandler = async (id: string, updatedData: ICustomerUpdate) => {
    if (!updatedData) return;
    setLoading(true);
    try {
      const updatedCustomer = await updateCustomer(id, updatedData);
      setCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === id ? updatedCustomer : cust))
      );
      return updatedCustomer;
    } catch (error) {
      setError("Failed to update Customer");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerHandler = async (id: string) => {
    setLoading(true);
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error("Error deleting Customer:", error);
      setError("Failed to delete Customer");
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomerHandler,
    deleteCustomerHandler,
    updateCustomerHandler,
    fetchCustomerByIdHandler,
    fetchCustomerByEmailHandler,
    fetchAllCustomersHandler,
    customers,
    customer,
    loading,
    error,
  };
};