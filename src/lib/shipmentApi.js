import api from './axios';

export const shipOrderWithShiprocket = async (orderId) => {
  const { data } = await api.put(`/shipping/${orderId}/ship`);
  return data;
};

export const shipOrderManually = async (orderId, payload) => {
  const { data } = await api.put(`/shipping/${orderId}/manual-ship`, payload);
  return data;
};

export const bulkShipOrders = async (orderIds) => {
  const { data } = await api.post('/shipping/bulk-ship', { orderIds });
  return data;
};

export const getOrderTracking = async (orderId) => {
  const { data } = await api.get(`/shipping/track/${orderId}`);
  return data;
};