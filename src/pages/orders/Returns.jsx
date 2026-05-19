import React, { useEffect, useMemo, useState } from 'react';
import {
  RotateCcw,
  PackageCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllReturns,
  updateReturnStatus,
  processRefund
} from '../../lib/returnApi';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [search, setSearch] = useState('');

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await getAllReturns();
      setReturns(data.returns || data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const normalizedReturns = useMemo(() => {
    return returns.map((item) => ({
      ...item,
      displayId: item.returnId || item._id?.slice(-8)?.toUpperCase() || 'N/A',
      customerName:
        item.user?.name ||
        item.customer?.name ||
        item.customerName ||
        'N/A',
      orderNumber:
        item.order?.orderNumber ||
        item.order?.orderId ||
        item.order?._id?.slice(-8)?.toUpperCase() ||
        item.orderId?.slice?.(-8)?.toUpperCase() ||
        'N/A',
      productName:
        item.items?.[0]?.name ||
        item.orderItems?.[0]?.name ||
        item.product?.name ||
        'N/A',
      reason: item.reason || item.returnReason || 'N/A',
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-IN')
        : 'N/A',
      status: item.status || item.returnStatus || 'Pending'
    }));
  }, [returns]);

  const filteredReturns = useMemo(() => {
    const value = search.toLowerCase();

    return normalizedReturns.filter((item) =>
      [
        item.displayId,
        item.customerName,
        item.orderNumber,
        item.productName,
        item.reason,
        item.status
      ]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }, [normalizedReturns, search]);

  const stats = [
    {
      title: 'Total Returns',
      value: normalizedReturns.length,
      icon: RotateCcw,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending',
      value: normalizedReturns.filter((item) => item.status === 'Pending').length,
      icon: Clock3,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Approved',
      value: normalizedReturns.filter((item) => item.status === 'Approved').length,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Rejected',
      value: normalizedReturns.filter((item) => item.status === 'Rejected').length,
      icon: XCircle,
      color: 'from-red-500 to-rose-500'
    }
  ];

  const getStatusClass = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-700',
      Approved: 'bg-emerald-100 text-emerald-700',
      Rejected: 'bg-red-100 text-red-700',
      Refunded: 'bg-blue-100 text-blue-700',
      Cancelled: 'bg-gray-100 text-gray-700'
    };

    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(`${id}-${status}`);
      await updateReturnStatus(id, status);
      toast.success(`Return ${status.toLowerCase()} successfully`);
      fetchReturns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update return');
    } finally {
      setActionLoading('');
    }
  };

  const handleRefund = async (id) => {
    try {
      setActionLoading(`${id}-refund`);
      await processRefund(id);
      toast.success('Refund processed successfully');
      fetchReturns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Refund failed');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Returns Management
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Track, review and manage customer return requests.
          </p>
        </div>

        <button
          onClick={fetchReturns}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Return Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Recent product return requests from customers.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search return request..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center">
            <RotateCcw className="mb-3 h-10 w-10 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-800">
              No return requests found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Return requests will appear here after customers submit them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Return ID
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Customer
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Product
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Reason
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Date
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReturns.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-100 transition hover:bg-purple-50/40"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-purple-700">
                      {item.displayId}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {item.customerName}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.orderNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {item.productName}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.reason}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.date}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={
                            item.status === 'Approved' ||
                            actionLoading === `${item._id}-Approved`
                          }
                          onClick={() =>
                            handleStatusUpdate(item._id, 'Approved')
                          }
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === `${item._id}-Approved`
                            ? 'Updating...'
                            : 'Approve'}
                        </button>

                        <button
                          disabled={
                            item.status === 'Rejected' ||
                            actionLoading === `${item._id}-Rejected`
                          }
                          onClick={() =>
                            handleStatusUpdate(item._id, 'Rejected')
                          }
                          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === `${item._id}-Rejected`
                            ? 'Updating...'
                            : 'Reject'}
                        </button>

                        <button
                          disabled={
                            item.status === 'Refunded' ||
                            actionLoading === `${item._id}-refund`
                          }
                          onClick={() => handleRefund(item._id)}
                          className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === `${item._id}-refund`
                            ? 'Processing...'
                            : 'Refund'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Returns;