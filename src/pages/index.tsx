/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { getColorFromURL, getPaletteFromURL, Palette } from "color-thief-node";

import { colors } from "@ace-ex/tokens";
import { getContrast, transparentize } from "polished";

import NextImage from "next/image";
import { Box, Button, Image, FileInput } from "@ace-ex/react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Meta } from "../components/Meta";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<Palette | null>(null);
  const [palette, setPalette] = useState<Palette[]>([]);

  const contrastColor = (color: string) => {
    if (color !== "rgb(null)") {
      return getContrast(color, "#FFF") < 3.5 ? "#000" : "#FFF";
    }
  };

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
      let urlFinal;
      let error;

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
    <>
      <Meta
        title="Home"
        path="/"
        description="Site para pegar cores e paletas de cores de imagens."
        image={{
          src: `${process.env.SITE_BASEURL}/logo.svg`,
          alt: "Logo do Image Colors",
        }}
      />
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
        <Box css={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ThemeToggle />
        </Box>
        <Box
          css={{
            mt: "$6",
            position: "relative",
            size: "$space$64",
          }}
        >
          <Image
            as={NextImage}
            css={{
              maxWidth: "$space$64",
              maxHeight: "$space$64",
              size: "100%",
              br: "$md",
              shadowXl: transparentize(0.6, colors.black),
            }}
            id="image"
            alt="Imagem"
            src={imageUrl !== "" ? imageUrl : "/cover.jpg"}
            fill
            sizes="256"
            priority
          />
        </Box>
        <Box
          css={{
            mt: "$6",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FileInput
            name="file"
            id="file"
            onChange={(e) => setFile(e.target.files![0])}
            content={file?.name || "Enviar imagem"}
          />
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
          <Box
            css={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => getColorsImage()}
              css={{
                color: contrastColor(`rgb(${color})`),
                bg: `rgb(${color})`,
              }}
              fullWidth
            >
              Pegar cor
            </Button>
            <Box css={{ mt: "$4", width: "100%" }}>
              {color && (
                <Box
                  css={{
                    p: "$2",
                    backgroundColor: `rgb(${color})`,
                    br: "$md",
                    color: contrastColor(`rgb(${color})`),
                  }}
                >
                  rgb({color[0]}, {color[1]}, {color[2]})
                </Box>
              )}
            </Box>
          </Box>
          <Box
            css={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => getPalettesImage()}
              css={{
                color: contrastColor(`rgb(${color})`),
                bg: `linear-gradient(to right, ${palette.map(
                  (colors) => `rgb(${colors})`,
                )})`,
              }}
              fullWidth
            >
              Pegar paleta de cores
            </Button>
            <Box css={{ mt: "$4", width: "100%" }}>
              {palette.map((colors, i) => (
                <Box
                  key={i}
                  css={{
                    p: "$2",
                    backgroundColor: `rgb(${colors})`,
                    color: contrastColor(`rgb(${colors})`),
                  }}
                >
                  rgb({colors[0]}, {colors[1]}, {colors[2]})
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
