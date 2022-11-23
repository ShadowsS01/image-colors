import { globalCss } from "@escola-ex/react";

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    margin: 0,
    padding: 0,
    border: 0,
    boxSizing: "border-box",
    transition: ".2s",
  },
  "ul[role='list'], ol[role='list']": { listStyle: "none" },
  "html:focus-within": { scrollBehavior: "smooth" },

  body: {
    minHeight: "100vh",
    fontFamily: "$default",
    backgroundColor: "$background",
    color: "$primary",
  },
});
