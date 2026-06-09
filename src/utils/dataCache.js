// utils/dataCache.js
// In-memory cache + promise deduplication — eliminates duplicate API calls
// across components that mount at the same time (Navbar, CategorySection, etc.)

const cache = {};
const promises = {};

/**
 * Generic cached GET helper.
 * - If data is already cached → returns instantly (no network).
 * - If a request is already in-flight → attaches to the same Promise.
 * - Otherwise → fires a new request, caches the result.
 *
 * @param {string} key       Unique cache key
 * @param {object} axiosInst Axios instance to use
 * @param {string} url       Relative URL to fetch
 * @param {Function} [pick]  Optional fn to extract the data from the response
 */
const cachedGet = (key, axiosInst, url, pick) => {
  if (cache[key] !== undefined) return Promise.resolve(cache[key]);
  if (promises[key]) return promises[key];

  pick = pick || ((res) => res?.data?.data);

  promises[key] = axiosInst
    .get(url, { skipLoader: true })
    .then((res) => {
      const data = pick(res);
      cache[key] = data;
      promises[key] = null;
      return data;
    })
    .catch((err) => {
      promises[key] = null;
      throw err;
    });

  return promises[key];
};

/** Invalidate a single cache entry (call after admin mutations) */
export const invalidateCache = (key) => {
  delete cache[key];
  delete promises[key];
};

/** Invalidate all cache entries */
export const clearAllCache = () => {
  Object.keys(cache).forEach((k) => delete cache[k]);
  Object.keys(promises).forEach((k) => delete promises[k]);
};

// ─── Public helpers ────────────────────────────────────────────────────────────

export const getCategories = (axiosInst) =>
  cachedGet("categories", axiosInst, "/getcategory", (res) =>
    res?.data?.status === 1 ? res.data.data : []
  );

export const getAnnouncements = (axiosInst) =>
  cachedGet("announcements", axiosInst, "/getannouncements", (res) =>
    res?.data?.status === 1 ? res.data.data : []
  );

export const getLatestArrivals = (axiosInst) =>
  cachedGet("latestArrivals", axiosInst, "/getlatestarrivals", (res) =>
    res?.data?.status === 1 ? res.data.data || [] : []
  );

export const getSliders = (axiosInst) =>
  cachedGet("sliders", axiosInst, "/getsliders", (res) =>
    res?.data?.status === 1 ? res.data.data || [] : []
  );