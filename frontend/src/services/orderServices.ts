import { IOrderUpdate, IOrderUpdateStatus, Order } from "../models/Order";
import { api, handleRequest } from "./baseService";
const ORDER_ENDPOINT = '/orders'


export const fetchAllOrders = async () => {
   return handleRequest<Order[]>(api.get(ORDER_ENDPOINT));
};

export const fetchOrdersByCustomer = async (customerId: string) => {
  return handleRequest<Order[]>(api.get(`${ORDER_ENDPOINT}/customer/${customerId}`));
}

export const fetchOrderById = async (id: string) => {
  return handleRequest<Order>(api.get(`${ORDER_ENDPOINT}/${id}`));
}

export const updateOrder = async (id: string, payload: IOrderUpdate) => {
  return handleRequest<Order>(api.put(`${ORDER_ENDPOINT}/${id}`, payload));
}

export const updateOrderStatus = async (id: string, payload: IOrderUpdateStatus) => {
  return handleRequest<Order>(api.patch(`${ORDER_ENDPOINT}/${id}/status`, payload));
}

export const deleteOrder = async (id: string) => {
  return handleRequest(api.delete(`${ORDER_ENDPOINT}/${id}`));
}