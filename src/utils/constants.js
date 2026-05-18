/**
 * Order Status Constants
 * Consistent across both Client and Admin panels.
 */
export const ORDER_STATUS = {
  PENDING: 1,
  ACCEPTED: 2,
  PREPARING: 3,
  SHIPPED: 4,
  DELIVERED: 5,
  CANCELLED: 6,
  RETURNED: 7,
};

/**
 * Mapping of status IDs to human-readable labels
 */
export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.ACCEPTED]: "Accepted",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.SHIPPED]: "Shipped",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.RETURNED]: "Returned",
};

/**
 * Mapping of status IDs to Tailwind color classes
 * (Commonly used in Admin tables and Profile views)
 */
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "bg-gray-100 text-gray-800",
  [ORDER_STATUS.ACCEPTED]: "bg-yellow-100 text-yellow-800",
  [ORDER_STATUS.PREPARING]: "bg-blue-100 text-blue-800",
  [ORDER_STATUS.SHIPPED]: "bg-purple-100 text-purple-800",
  [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
  [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
  [ORDER_STATUS.RETURNED]: "bg-orange-100 text-orange-800",
};
