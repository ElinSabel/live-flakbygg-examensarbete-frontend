import { useEffect, useState } from "react";
import { deleteOrder, fetchAllOrders, fetchOrderById, fetchOrdersByCustomer, updateOrder, updateOrderStatus } from "../services/orderServices";
import { IOrderUpdate, IOrderUpdateStatus, Order } from "../models/Order";


export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orders.length === 0) fetchAllOrdersHandler();
  }, []);

  const fetchAllOrdersHandler = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchOrderById(id);
      setOrder(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByCustomerHandler = async (customerId: string) => {
    setLoading(true);
    try {
      const data = await fetchOrdersByCustomer(customerId);
      setCustomerOrders(data);
      return data;
    } finally {
      setLoading(false);
    }
  };


  const updateStatusOrderHandler = async (
    id: string,
    payload: IOrderUpdateStatus
  ) => {
    setLoading(true);
     setError("");
    try {
      const updated = await updateOrderStatus(id, payload);
      setOrder(updated);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      return updated;
    } catch (err) {
      console.error(err);
      setError("Failed to update order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderHandler = async (
    id: string,
    updatedData: IOrderUpdate
  ) => {
    setLoading(true);
    setError("");
    try {
      const updatedOrder = await updateOrder(id, updatedData);
      setOrder(updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updatedOrder : o))
      );
      return updatedOrder;
    } catch (err) {
      console.error(err);
      setError("Failed to update order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrderHandler = async (id: string) => {
    setLoading(true);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    customerOrders,
    order,
    loading,
    error,
    fetchAllOrdersHandler,
    fetchOrderByIdHandler,
    fetchOrdersByCustomerHandler,
    updateOrderHandler,
    updateStatusOrderHandler,
    deleteOrderHandler,
  };
};
