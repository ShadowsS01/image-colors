/* eslint-disable @next/next/no-img-element */
import { FormEvent, useCallback, useEffect, useState } from "react";
import { getColorFromURL, getPaletteFromURL, Palette } from "color-thief-node";

import { Box, Button, darkTheme, Text, TextInput } from "@escola-ex/react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<Palette | null>(null);
  const [palette, setPalette] = useState<Palette[]>([]);

  const [showingFormUrl, setShowingFormUrl] = useState(false);
  const [showingFormFile, setShowingFormFile] = useState(true);

  const getColorsImage = async () => {
    try {
      const img = document.querySelector("#image");
      if (img) {
        const src = img.getAttribute("src");
        console.log({ image: src });
        const dominantColor = await getColorFromURL(src!);
        const [r, g, b] = dominantColor;
        console.log(`Dominant Color: rgb(${r}, ${g}, ${b})`);
        setColor(dominantColor);
      } else {
        throw new Error("Imagem não encontrada!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getPalettesImage = async () => {
    try {
      const img = document.querySelector("#image");
      if (img) {
        const src = img.getAttribute("src");
        const colorPalette = await getPaletteFromURL(src!);
        console.log("Color Palette:\n", colorPalette);
        setPalette(colorPalette);
      } else {
        throw new Error("Imagem não encontrada!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function download(url: string) {
    var urlFinal;
    var error;

    await fetch(url, {
      method: "GET",
    })
      .then((data) => {
        return data.blob();
      })
      .then((result) => {
        urlFinal = URL.createObjectURL(result);
      })
      .catch((e) => {
        error = e;
      });

    return { urlFinal, error };
  }

  useEffect(() => {
    try {
      const reader = new FileReader();
      if (file !== null) {
        if (file.type.startsWith("image/")) {
          const getData = async () => {
            reader.readAsDataURL(file);
            reader.onload = () => {
              setImageUrl(reader.result?.toString()!);
            };
          };
          getData();
        } else {
          throw new Error("Coloque uma imagem!");
        }
      }
    } catch (e) {
      alert(e);
      setFile(null);
    }
  }, [file]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & {
      url: HTMLInputElement;
    };
    const url = form.url.value;

    try {
      if (url || url.trim().length > 0) {
        console.log(`url: ${url}`);
        var img = document.createElement("img");
        img.src = url;
        img.onload = async () => {
          console.log("img loaded");

          const { urlFinal, error } = await download(url);
          if (error) {
            throw error;
          } else if (urlFinal) {
            setImageUrl(urlFinal);
          } else {
            throw new Error("Houve um erro!");
          }
        };
        img.onerror = () => {
          setImageUrl("");
          console.log("img error");
          throw new Error("Imagem não encontrado!");
        };
      } else {
        throw new Error("Precisa ter uma url!");
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        maxWidth: "500px",
        mx: "auto",
        my: "$16",
      }}
    >
      <Box css={{ width: "50%" }}>
        <ThemeToggle />
      </Box>
      <Box
        css={{
          maxWidth: "$space$80",
          maxHeight: "$space$80",
          mt: "$12",
        }}
      >
        <img
          id="image"
          style={{ borderRadius: "8px" }}
          alt="img"
          src={imageUrl !== "" ? imageUrl : "/cover.jpg"}
          width={100}
          height={100}
        />
      </Box>
      <Box
        as="form"
        css={{
          my: "$3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "$2",
          width: "100%",
        }}
        onSubmit={handleSubmit}
      >
        {showingFormFile ? (
          <TextInput
            type="file"
            name="file"
            id="file"
            onChange={(e) => setFile(e.target.files![0])}
          />
        ) : (
          <>
            <TextInput
              type="url"
              name="url"
              id="url"
              placeholder="Digite uma url de imagem"
            />
            <Button type="submit" size="sm">
              Submit
            </Button>
          </>
        )}
        <Box css={{ maxWidth: "50%", color: "$primary" }}>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => {
              if (showingFormFile) {
                setShowingFormFile(false);
                setShowingFormUrl(true);
              } else if (showingFormUrl) {
                setShowingFormFile(true);
                setShowingFormUrl(false);
              }
            }}
          >
            {showingFormFile
              ? "Adicionar url"
              : showingFormUrl && "Adicionar imagem"}
          </Button>
        </Box>
      </Box>
      <Box
        css={{
          mt: "$6",
          display: "flex",
          justifyContent: "space-between",
          gap: "$6",
          width: "100%",
        }}
      >
        <Box css={{ width: "50%" }}>
          <Button
            variant="secondary"
            onClick={() => getColorsImage()}
            css={{ bg: `rgb(${color})` }}
          >
            Pegar cor
          </Button>
          <Box css={{ mt: "$4" }}>
            {color && (
              <Box
                css={{
                  p: "$2",
                  backgroundColor: `rgb(${color})`,
                  br: "$md",
                  color: "$gray100",
                }}
              >
                rgb({color[0]}, {color[1]}, {color[2]})
              </Box>
            )}
          </Box>
        </Box>
        <Box css={{ width: "50%" }}>
          <Button
            variant="secondary"
            onClick={() => getPalettesImage()}
            css={{
              bg: `linear-gradient(to right, ${palette.map(
                (colors) => `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`
              )})`,
            }}
          >
            Pegar paleta de cores
          </Button>
          <Box css={{ mt: "$4" }}>
            {palette.map((colors, i) => (
              <Box
                key={i}
                css={{
                  p: "$2",
                  backgroundColor: `rgb(${colors})`,
                  color: "$gray100",
                }}
              >
                rgb({colors[0]}, {colors[1]}, {colors[2]})
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
