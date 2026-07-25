import type { ChangeEvent, InvalidEvent } from "react";
import { INPUT_TYPE } from "@/constants";

const MESSAGES = {
  valueMissing: "Please fill out this field.",
  typeMismatchEmail: "Please enter a valid email address.",
  tooShort: (min: number, current: number) =>
    `Please enter at least ${min} characters. You entered ${current}.`,
} as const;

export function setEnglishValidity(e: InvalidEvent<HTMLInputElement>) {
  const input = e.currentTarget;
  if (input.validity.valueMissing) {
    input.setCustomValidity(MESSAGES.valueMissing);
    return;
  }
  if (input.type === INPUT_TYPE.EMAIL && input.validity.typeMismatch) {
    input.setCustomValidity(MESSAGES.typeMismatchEmail);
    return;
  }
  if (input.validity.tooShort) {
    input.setCustomValidity(
      MESSAGES.tooShort(input.minLength, input.value.length),
    );
    return;
  }
  input.setCustomValidity("");
}

export function clearCustomValidity(e: ChangeEvent<HTMLInputElement>) {
  e.currentTarget.setCustomValidity("");
}
