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
  IndianRupee,
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

const formatChartDate = (value, timeframe) => {
  if (!value || timeframe !== "daily") return value;
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch (error) {
    // Return original value if parsing fails
  }
  return value;
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("daily");
  const [userCount, setUserCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
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

  // Handle window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const data = res.data?.data?.recentOrders || res.data?.recentOrders || res.data?.data || res.data;
      setRecentOrders(Array.isArray(data) ? data : []);
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
    const loadAllStats = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDashboardData(),
          fetchuserCount(),
          fetchChartData(),
          fetchRecentOrders(),
          fetchOrderStatusData(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAllStats();
  }, []);

  const getCurrentData = () => {
    return chartData[timeframe] || [];
  };

  if (loading) {
    return (
      <div className="glamloader-overlay" aria-label="Loading" role="status">
        <div className="glamloader-logo">
          KUNDRAT
          <div className="glamloader-logo-fill">KUNDRAT</div>
        </div>
        <div className="glamloader-ring">
          <svg viewBox="0 0 72 72">
            <circle className="glamloader-ring-track" cx="36" cy="36" r="32" />
            <circle className="glamloader-ring-arc glamloader-ring-arc--a2" cx="36" cy="36" r="32" />
            <circle className="glamloader-ring-arc glamloader-ring-arc--a1" cx="36" cy="36" r="32" />
          </svg>
          <div className="glamloader-ring-dot" />
        </div>
      </div>
    );
  }

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
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow min-w-0 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-2.5 sm:p-3 rounded-lg ${colorClasses[color].split(" ")[2]}`}
          >
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClasses[color].split(" ")[1]}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center text-xs sm:text-sm ${trend === "up" ? "text-green-600" : "text-red-600"
                }`}
            >
              <TrendingUp
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 ${trend === "down" ? "rotate-180" : ""
                  }`}
              />
              {trendValue}%
            </div>
          )}
        </div>
        <h3 className="text-gray-500 text-xs sm:text-sm font-medium">{title}</h3>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-1 break-all sm:break-normal">{value}</p>
        {subtitle && <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{subtitle}</p>}
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
            className="mt-2 w-full md:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer text-center"
          >
            Refresh Data
          </button>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatRevenue(dashboardCount.totalRevenue)} // Updated
            icon={IndianRupee}
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 min-w-0 w-full overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Revenue Overview
                <span className="text-xs sm:text-sm text-gray-500 block">
                  Excludes cancelled orders only
                </span>
              </h2>
              <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
                {["daily", "weekly", "monthly"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`flex-1 md:flex-initial px-3 py-1.5 text-xs sm:text-sm rounded-md capitalize transition-colors cursor-pointer text-center ${timeframe === period
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <AreaChart data={getCurrentData()} margin={{ top: 10, right: 5, left: isMobile ? -25 : -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    timeframe === "monthly"
                      ? "month"
                      : timeframe === "weekly"
                        ? "week"
                        : "date"
                  }
                  tickFormatter={(value) => formatChartDate(value, timeframe)}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(val) => {
                    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                    return `₹${val}`;
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `₹${value.toLocaleString()}` : value,
                    name === "revenue"
                      ? "Revenue (Valid Orders)"
                      : "Total Orders",
                  ]}
                  labelFormatter={(label) => formatChartDate(label, timeframe)}
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 min-w-0 w-full overflow-hidden">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
              Order Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="45%"
                  labelLine={!isMobile}
                  label={({ name, percent }) =>
                    isMobile 
                      ? `${(percent * 100).toFixed(0)}%`
                      : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={isMobile ? 65 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={isMobile ? 60 : 36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: isMobile ? "11px" : "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 mb-8 min-w-0 w-full overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Orders Overview
              </h2>
              <span className="text-xs sm:text-sm text-gray-500">
                Stacked view: Green (Revenue Contributing) + Red (Cancelled) =
                Total
              </span>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
              {["daily", "weekly", "monthly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`flex-1 md:flex-initial px-3 py-1.5 text-xs sm:text-sm rounded-md capitalize transition-colors cursor-pointer text-center ${timeframe === period
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <BarChart data={getCurrentData()} margin={{ top: 10, right: 5, left: isMobile ? -30 : -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  timeframe === "monthly"
                    ? "month"
                    : timeframe === "weekly"
                      ? "week"
                      : "date"
                }
                tickFormatter={(value) => formatChartDate(value, timeframe)}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    eligibleOrders: "Revenue Contributing Orders",
                    cancelledOrders: "Cancelled Orders",
                  };
                  return [value, labels[name] || name];
                }}
                labelFormatter={(label) => {
                  const formatted = formatChartDate(label, timeframe);
                  return timeframe === "daily" ? formatted : `Period: ${formatted}`;
                }}
              />
              <Legend wrapperStyle={{ fontSize: isMobile ? "11px" : "12px" }} />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {getCurrentData().reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {getCurrentData().reduce(
                  (sum, item) => sum + item.eligibleOrders,
                  0
                )}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Revenue Contributing</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-red-600">
                {getCurrentData().reduce(
                  (sum, item) => sum + (item.cancelledOrders || 0),
                  0
                )}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Cancelled</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
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
              <p className="text-xs sm:text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 min-w-0 w-full overflow-hidden">
          <div className="flex flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-2 sm:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders">
              <button className="px-0 sm:px-4 py-1 sm:py-2 text-black hover:text-gray-600 underline cursor-pointer text-sm sm:text-base">View All Orders</button>
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
                {[...recentOrders]
                  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                  .slice(0, 10)
                  .map((order) => (
                    <tr key={order.id || order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {order.id || order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.fullName || order.user?.name || (typeof order.user === "string" ? order.user : "N/A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ₹{(order.total || order.totalAmount || order.amount || 0).toLocaleString()}
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
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
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
