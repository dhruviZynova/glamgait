/**
 * loaderService — singleton bridge between Axios interceptors and React Context.
 *
 * Axios cannot use React hooks directly, so we store references to
 * the context's show/hide functions here. LoaderContext registers them
 * on mount, and Axios calls them whenever a request starts/ends.
 */
const loaderService = {
  _show: null,
  _hide: null,

  /** Called once by LoaderContext on mount to hand over its updater functions. */
  register(show, hide) {
    this._show = show;
    this._hide = hide;
  },

  show() {
    this._show?.();
  },

  hide() {
    this._hide?.();
  },
};

export default loaderService;
