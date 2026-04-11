// // // // src/hooks/useScrollRestoration.js
// // // import { useEffect, useLayoutEffect } from "react";
// // // import { useLocation } from "react-router-dom";

// // // const scrollPositions = {};

// // // export default function useScrollRestoration(pageKey) {
// // //   const location = useLocation();

// // //   // Save scroll before leaving page
// // //   useEffect(() => {
// // //     return () => {
// // //       scrollPositions[pageKey] = window.scrollY;
// // //     };
// // //   }, [pageKey]);

// // //   // Restore scroll as soon as layout is ready
// // //   useLayoutEffect(() => {
// // //     const savedY = scrollPositions[pageKey];
// // //     if (savedY !== undefined) {
// // //       // small delay helps ensure images and sections have loaded
// // //       requestAnimationFrame(() => {
// // //         window.scrollTo({
// // //           top: savedY,
// // //           behavior: "instant", // no animation
// // //         });
// // //       });
// // //     }
// // //   }, [location.pathname, pageKey]);
// // // }



// // // src/hooks/useScrollRestoration.js
// // import { useEffect, useLayoutEffect } from "react";
// // import { useLocation } from "react-router-dom";

// // const scrollPositions = {};

// // export default function useScrollRestoration(pageKey) {
// //   const location = useLocation();
// //   const currentPath = location.pathname;

// //   // Routes where scroll MUST go to top
// //   const scrollToTopPaths = ["/product/", "/shop", "/single-product"];

// //   const shouldScrollToTop = scrollToTopPaths.some((p) =>
// //     currentPath.startsWith(p)
// //   );

// //   // Restore or Scroll-to-Top
// //   useLayoutEffect(() => {
// //     if (shouldScrollToTop) {
// //       window.scrollTo({ top: 0, behavior: "instant" });
// //       return;
// //     }

// //     // Restore scroll for normal pages
// //     const savedY = scrollPositions[pageKey];
// //     if (savedY !== undefined) {
// //       requestAnimationFrame(() => {
// //         window.scrollTo({ top: savedY, behavior: "instant" });
// //       });
// //     }
// //   }, [currentPath, pageKey]);

// //   // Save scroll before leaving page
// //   useEffect(() => {
// //     return () => {
// //       scrollPositions[pageKey] = window.scrollY;
// //     };
// //   }, [pageKey]);
// // }


// // src/hooks/useScrollRestoration.js
// import { useEffect, useLayoutEffect } from "react";
// import { useLocation } from "react-router-dom";

// const scrollPositions = {};

// export default function useScrollRestoration(pageKey) {
//   const location = useLocation();

//   // Save scroll before leaving page
//   useEffect(() => {
//     return () => {
//       scrollPositions[pageKey] = window.scrollY;
//     };
//   }, [pageKey]);

//   // Restore scroll as soon as layout is ready
//   useLayoutEffect(() => {
//     const savedY = scrollPositions[pageKey];
//     if (savedY !== undefined) {
//       requestAnimationFrame(() => {
//         window.scrollTo({
//           top: savedY,
//           behavior: "instant",
//         });
//       });
//     }
//   }, [location.pathname, pageKey]);
// }


// src/hooks/useScrollRestoration.js
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export default function useScrollRestoration(pageKey) {
  const { pathname } = useLocation();

  // Restore only for allowed pages
  const allowedPages = ["/", "/shop"];
  const shouldRestore = allowedPages.includes(pathname);

  // Restore scroll position
  useLayoutEffect(() => {
    if (shouldRestore) {
      const savedY = scrollPositions[pageKey];
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY || 0, behavior: "instant" });
      });
    } else {
      // For all other pages → ALWAYS scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, pageKey, shouldRestore]);

  // Save scroll on unmount
  useEffect(() => {
    return () => {
      if (shouldRestore) {
        scrollPositions[pageKey] = window.scrollY;
      }
    };
  }, [pageKey, shouldRestore]);
}
