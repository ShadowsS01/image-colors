import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Button, Icon } from "@ace-ex/react";

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
        type="button"
        variant={"tertiary"}
        onClick={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        aria-label="Trocar tema"
        title={`Trocar o tema para ${theme === "dark" ? "claro" : "escuro"}`}
      >
        Trocar tema
        {theme === "dark" ? (
          <Icon iconName="Sun" size={25} />
        ) : (
          <Icon iconName="Moon" size={25} />
        )}
      </Button>
    </>
  );
};
