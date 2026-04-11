// utils/dataCache.js
let cache = {
  categories: null,
  announcements: null,
};

let promises = {
  categories: null,
  announcements: null,
};

export const getCategories = async (axiosInstance) => {
  if (cache.categories) return cache.categories;
  if (promises.categories) return promises.categories;

  promises.categories = axiosInstance.get("/getcategory")
    .then(res => {
      if (res?.data?.status === 1) {
        cache.categories = res.data.data;
        return cache.categories;
      }
      throw new Error("Failed to fetch categories");
    })
    .catch(err => {
      promises.categories = null;
      throw err;
    });

  return promises.categories;
};

export const getAnnouncements = async (axiosInstance) => {
  if (cache.announcements) return cache.announcements;
  if (promises.announcements) return promises.announcements;

  promises.announcements = axiosInstance.get("/getannouncements")
    .then(res => {
      if (res?.data?.status === 1) {
        cache.announcements = res.data.data;
        return cache.announcements;
      }
      throw new Error("Failed to fetch announcements");
    })
    .catch(err => {
      promises.announcements = null;
      throw err;
    });

  return promises.announcements;
};