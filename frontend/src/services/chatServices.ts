import { api, handleRequest } from "./baseService";

export const fetchChatMessages = (requestId: string, token: string) => {
  return handleRequest(
    api.get(`/chats/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};
