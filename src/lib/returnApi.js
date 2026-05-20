import api from '@/lib/api';

export const getAllReturns = async () => {
  const { data } = await api.get('/returns/admin/all');
  return data;
};

export const updateReturnStatus = async (id, status) => {
  const { data } = await api.put(`/returns/admin/${id}/status`, {
    status,
  });

  return data;
};

export const processRefund = async (id) => {
  const { data } = await api.put(`/returns/admin/${id}/refund`);

  return data;
};