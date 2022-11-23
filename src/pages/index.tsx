/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useState } from "react";
import { getColorFromURL, getPaletteFromURL, Palette } from "color-thief-node";

import { Box, Button } from "@escola-ex/react";
import { ThemeToggle } from "../components/ThemeToggle";
import { TextInput } from "../components/Input";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<Palette | null>(null);
  const [palette, setPalette] = useState<Palette[]>([]);

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

  useEffect(() => {
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

    try {
      const reader = new FileReader();
      if (file !== null) {
        if (file?.type.startsWith("image/")) {
          const getData = async () => {
            reader.readAsDataURL(file);
            reader.onload = async () => {
              const imageBase64 = reader.result?.toString();
              if (imageBase64) {
                const { error, urlFinal } = await download(imageBase64);
                console.log(urlFinal);

                if (error) {
                  throw new Error("Erro ao carregar a imagem!");
                }

                if (urlFinal) {
                  setImageUrl(urlFinal);
                } else {
                  setImageUrl(imageBase64);
                }
              } else {
                throw new Error("Erro ao carregar a imagem!");
              }
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

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        mx: "auto",
        my: "$16",
        px: "$4",

        "@sm": {
          px: "0",
        },
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
          width={130}
          height={100}
        />
      </Box>
      <Box
        css={{
          mt: "$3",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box>
          <TextInput
            type="file"
            name="file"
            id="file"
            value={file?.name || ""}
            onChange={(e) => setFile(e.target.files![0])}
          />
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
            type="button"
            variant="secondary"
            onClick={() => getColorsImage()}
            css={{ color: "$primary", bg: `rgb(${color})` }}
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
            type="button"
            variant="secondary"
            onClick={() => getPalettesImage()}
            css={{
              color: "$primary",
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
