import { ComponentProps, ElementRef, forwardRef } from "react";
import { TextInputContainer, Input as StyledInput } from "./styles";

export interface TextInputProps
  extends Omit<ComponentProps<typeof StyledInput>, "size"> {}

export const TextInput = forwardRef<
  ElementRef<typeof StyledInput>,
  TextInputProps
>(({ prefix, value, ...props }, ref) => {
  return (
    <TextInputContainer>
      <StyledInput ref={ref} {...props} />
      {value ? value : "Enviar imagem"}
    </TextInputContainer>
  );
});

TextInput.displayName = "TextInput";
