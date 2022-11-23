import { darkTheme, styled } from "@escola-ex/react";

export const TextInputContainer = styled("label", {
  bg: "$gray200",
  color: "$primary",
  br: "$sm",
  boxSizing: "border-box",
  border: "2px solid transparent",
  display: "flex",
  alignItems: "center",
  transitionProperty:
    "color, background-color, border-color, text-decoration-color, fill, stroke",
  transitionDuration: "300ms",

  [`.${darkTheme} &`]: {
    bg: "$gray800",
  },

  p: "$3",
  cursor: "pointer",
  "&:hover": {
    bg: "$gray300",

    [`.${darkTheme} &`]: {
      bg: "$gray700",
    },
  },
});

export const Input = styled("input", {
  "&[type=file]": {
    display: "none",
  },
});
