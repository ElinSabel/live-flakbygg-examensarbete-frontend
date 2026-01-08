import { Request, IRequestCreate, IRequestUpdate, IRequestUpdateSeller, IRequestUpdateStatus, IRequestUpdatePrice } from "../models/Request";
import { api, handleRequest } from "./baseService";
const REQUEST_ENDPOINT = '/camper-requests'


export const fetchAllRequests = async () => {
   return handleRequest<Request[]>(api.get(REQUEST_ENDPOINT));
};

export const fetchRequestByCustomer = async (customerId: string) => {
  return handleRequest<Request[]>(api.get(`${REQUEST_ENDPOINT}/customer/${customerId}`));
}

export const fetchRequestById = async (id: string) => {
  return handleRequest<Request>(api.get(`${REQUEST_ENDPOINT}/${id}`));
}

export const createRequest = async (payload: IRequestCreate) => {
  return handleRequest<Request>(api.post(REQUEST_ENDPOINT, payload));
}

export const updateRequest = async (id: string, payload: IRequestUpdate) => {
  return handleRequest<Request>(api.put(`${REQUEST_ENDPOINT}/${id}`, payload));
}

export const updateRequestSeller = async (id: string, sellerId: IRequestUpdateSeller) => {
  return handleRequest<Request>(api.patch(`${REQUEST_ENDPOINT}/${id}/seller`, sellerId));
}

export const updateRequestStatus = async (id: string, payload: IRequestUpdateStatus) => {
  return handleRequest<Request>(api.patch(`${REQUEST_ENDPOINT}/${id}/status`, payload));
}

export const updateRequestPrice = async (id: string, payload: IRequestUpdatePrice) => {
  return handleRequest<Request>(api.patch(`${REQUEST_ENDPOINT}/${id}/price`, payload));
}

export const deleteRequest = async (id: string) => {
  return handleRequest(api.delete(`${REQUEST_ENDPOINT}/${id}`));
}