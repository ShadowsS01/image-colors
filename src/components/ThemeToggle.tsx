import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Button } from "@escola-ex/react";

import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        variant={"tertiary"}
        onClick={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        aria-label="Trocar tema"
        title={`Trocar o tema para ${theme === "dark" ? "claro" : "escuro"}`}
      >
        Trocar tema
        {theme === "dark" ? <BiSun size={25} /> : <BiMoon size={25} />}
      </Button>
    </>
  );
};
