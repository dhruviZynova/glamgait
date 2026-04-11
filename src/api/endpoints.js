import { ApiURL } from "../Variable";

export const SLIDER_ENDPOINTS = {
  GET_SLIDERS: `${ApiURL}/getsliders`,
  ADD_SLIDER: `${ApiURL}/addslider`,
  UPDATE_SLIDER: `${ApiURL}/updateslider`,
  DELETE_SLIDER: (imageId) => `${ApiURL}/deleteslider/${imageId}`,
};