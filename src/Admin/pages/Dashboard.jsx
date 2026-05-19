import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApiURL } from "../../Variable";
import { adminAxios } from "../../Axios/axios";
import { ORDER_STATUS, STATUS_LABELS, STATUS_COLORS } from "../../utils/constants";

const formatRevenue = (revenue) => {
  if (revenue >= 100000) {
    return `₹${(revenue / 100000).toFixed(2)}L`; // Lakhs
  } else if (revenue >= 10000) {
    return `₹${(revenue / 1000).toFixed(1)}K`; // Thousands
  } else {
    return `₹${revenue.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("daily");
  const [userCount, setUserCount] = useState([]);
  const [dashboardCount, setDashboardCount] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    preparingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
  });
  const [chartData, setChartData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const res = await adminAxios.get(`${ApiURL}/stats`);
      setDashboardCount(res.data.data.stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchuserCount = async () => {
    try {
      const res = await adminAxios.get(`${ApiURL}/usercount`);
      setUserCount(res.data.data.count);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      const res = await adminAxios.get(`${ApiURL}/chart-data`);
      setChartData(res.data.data.chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Fetch order status data
  const fetchOrderStatusData = async () => {
    try {
      const res = await adminAxios.get(`${ApiURL}/order-status-data`);
      setOrderStatusData(res.data.data.orderStatusData);
    } catch (error) {
      console.error("Error fetching order status data:", error);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const res = await adminAxios.get(`${ApiURL}/recent-orders`);
      setRecentOrders(res.data.data.recentOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  // Check if order should contribute to revenue
  const isRevenueEligible = (status) => {
    const statusId = parseInt(status);
    const eligibleStatuses = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
    ];
    return eligibleStatuses.includes(statusId);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchuserCount();
    fetchChartData();
    fetchRecentOrders();
    fetchOrderStatusData();
  }, []);

  const getCurrentData = () => {
    return chartData[timeframe] || [];
  };

  const StatCard = ({
    title,
    value,
    // eslint-disable-next-line no-unused-vars
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
    subtitle,
  }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      yellow: "bg-yellow-500 text-yellow-600 bg-yellow-50",
      red: "bg-red-500 text-red-600 bg-red-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      orange: "bg-orange-500 text-orange-600 bg-orange-50",
      gray: "bg-gray-500 text-gray-600 bg-gray-50",
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg ${colorClasses[color].split(" ")[2]}`}
          >
            <Icon className={`h-6 w-6 ${colorClasses[color].split(" ")[1]}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : "text-red-600"
                }`}
            >
              <TrendingUp
                className={`h-4 w-4 mr-1 ${trend === "down" ? "rotate-180" : ""
                  }`}
              />
              {trendValue}%
            </div>
          )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    );
  };

  return (
    <div className="pb-8">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Glam Gait Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer"
          >
            Refresh Data
          </button>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatRevenue(dashboardCount.totalRevenue)} // Updated
            icon={DollarSign}
            color="green"
            subtitle="Excluding cancelled orders only"
          />
          <StatCard
            title="Total Orders"
            value={dashboardCount?.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={userCount}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Delivered Orders"
            value={dashboardCount?.deliveredOrders.toLocaleString()}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Pending"
            value={dashboardCount?.pendingOrders}
            icon={Clock}
            color="gray"
          />
          <StatCard
            title="Accepted"
            value={dashboardCount?.acceptedOrders}
            icon={AlertCircle}
            color="yellow"
          />
          <StatCard
            title="Preparing"
            value={dashboardCount?.preparingOrders}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Shipped"
            value={dashboardCount?.shippedOrders}
            icon={Truck}
            color="purple"
          />
          <StatCard
            title="Delivered"
            value={dashboardCount?.deliveredOrders}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Cancelled"
            value={dashboardCount?.cancelledOrders}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`₹${dashboardCount?.todayRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
            subtitle="Excluding cancelled orders only"
          />
          <StatCard
            title="Today's Orders"
            value={dashboardCount?.todayOrders}
            icon={Calendar}
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Revenue Overview
                <span className="text-sm text-gray-500 block">
                  Excludes cancelled orders only
                </span>
              </h2>
              <div className="flex gap-2">
                {["daily", "weekly", "monthly"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 text-sm rounded-md capitalize transition-colors cursor-pointer ${timeframe === period
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    timeframe === "monthly"
                      ? "month"
                      : timeframe === "weekly"
                        ? "week"
                        : "date"
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `₹${value.toLocaleString()}` : value,
                    name === "revenue"
                      ? "Revenue (Valid Orders)"
                      : "Total Orders",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC4899"
                  fill="#EC489950"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Orders Overview
              </h2>
              <span className="text-sm text-gray-500">
                Stacked view: Green (Revenue Contributing) + Red (Cancelled) =
                Total
              </span>
            </div>
            <div className="flex gap-2">
              {["daily", "weekly", "monthly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-sm rounded-md capitalize transition-colors cursor-pointer ${timeframe === period
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  timeframe === "monthly"
                    ? "month"
                    : timeframe === "weekly"
                      ? "week"
                      : "date"
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    eligibleOrders: "Revenue Contributing Orders",
                    cancelledOrders: "Cancelled Orders",
                  };
                  return [value, labels[name] || name];
                }}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="eligibleOrders"
                fill="#10B981"
                name="Revenue Contributing"
                stackId="stack"
              />
              <Bar
                dataKey="cancelledOrders"
                fill="#EF4444"
                name="Cancelled"
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {getCurrentData().reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {getCurrentData().reduce(
                  (sum, item) => sum + item.eligibleOrders,
                  0
                )}
              </p>
              <p className="text-sm text-gray-500">Revenue Contributing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {getCurrentData().reduce(
                  (sum, item) => sum + (item.cancelledOrders || 0),
                  0
                )}
              </p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(
                  (getCurrentData().reduce(
                    (sum, item) => sum + item.eligibleOrders,
                    0
                  ) /
                    Math.max(
                      getCurrentData().reduce(
                        (sum, item) => sum + item.orders,
                        0
                      ),
                      1
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex  items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders">
              <button className="mt-2 px-4 py-2 text-black hover:text-gray-600 underline cursor-pointer">View All Orders</button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Revenue Impact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders?.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.fullName || order.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[parseInt(order.status)] || STATUS_COLORS[ORDER_STATUS.CANCELLED]}`}
                      >
                        {STATUS_LABELS[parseInt(order.status)] || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${isRevenueEligible(order.status)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {isRevenueEligible(order.status)
                          ? "Counts"
                          : "Excluded"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
