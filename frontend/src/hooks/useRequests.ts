import { useEffect, useState } from "react";
import {
  createRequest,
  deleteRequest,
  fetchAllRequests,
  fetchRequestByCustomer,
  fetchRequestById,
  updateRequest,
  updateRequestPrice,
  updateRequestSeller,
  updateRequestStatus,
} from "../services/requestServices";
import {
  Request,
  IRequestCreate,
  IRequestUpdate,
  IRequestUpdateSeller,
  IRequestUpdateStatus,
  IRequestUpdatePrice,
} from "../models/Request";

export const useRequest = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [customerRequests, setCustomerRequests] = useState<Request[]>([]);
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (requests.length === 0) fetchAllRequestsHandler();
  }, []);

  const fetchAllRequestsHandler = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(data);
    } catch {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchRequestById(id);
      setRequest(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestsByCustomerHandler = async (customerId: string) => {
    setLoading(true);
    try {
      const data = await fetchRequestByCustomer(customerId);
      setCustomerRequests(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createRequestHandler = async (payload: IRequestCreate) => {
    setLoading(true);
    try {
      const newRequest = await createRequest(payload);
      setRequests((prev) => [...prev, newRequest]);
      setCustomerRequests((prev) => [...prev, newRequest]);
      setRequest(newRequest);
      return newRequest;
    } finally {
      setLoading(false);
    }
  };

 
  const updateSellerRequestHandler = async (
    id: string,
    payload: IRequestUpdateSeller
  ) => {
    setLoading(true);
    try {
      const updated = await updateRequestSeller(id, payload);
      setRequest(updated);
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
      return updated;
    } catch (err) {
        console.error(err);
        setError("Failed to update request");
        return null;
      } finally {
        setLoading(false);
      }
  };

  const updateStatusRequestHandler = async (
    id: string,
    payload: IRequestUpdateStatus
  ) => {
    setLoading(true);
    try {
      const updated = await updateRequestStatus(id, payload);
      setRequest(updated);
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
      return updated;
    } catch (err) {
        console.error(err);
        setError("Failed to update request status");
        return null;
      } finally {
        setLoading(false);
      }
  };

  const updatePriceRequestHandler = async (
    id: string,
    payload: IRequestUpdatePrice
  ) => {
    setLoading(true);
    try {
      const updated = await updateRequestPrice(id, payload);
      setRequest(updated);
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
      return updated;
    } catch (err) {
        console.error(err);
        setError("Failed to update request price");
        return null;
      } finally {
        setLoading(false);
      }
  };

  const updateRequestHandler = async (
    id: string,
    updatedData: IRequestUpdate
  ) => {
    setLoading(true);
    setError("");
    try {
      const updatedRequest = await updateRequest(id, updatedData);
      setRequest(updatedRequest);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? updatedRequest : r))
      );
      return updatedRequest;
    } catch (err) {
      console.error(err);
      setError("Failed to update request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequestHandler = async (id: string) => {
  setLoading(true);
  try {
    await deleteRequest(id);
    setRequests((prev) => prev.filter((r) => r._id !== id));
    setCustomerRequests((prev) => prev.filter((r) => r._id !== id));
    setRequest(null);
  } finally {
    setLoading(false);
  }
};

  return {
    requests,
    customerRequests,
    request,
    loading,
    error,
    fetchAllRequestsHandler,
    fetchRequestByIdHandler,
    fetchRequestsByCustomerHandler,
    createRequestHandler,
    updateRequestHandler,
    updateSellerRequestHandler,
    updateStatusRequestHandler,
    updatePriceRequestHandler,
    deleteRequestHandler,
  };
};
