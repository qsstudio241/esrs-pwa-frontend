import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("mostra messaggio selezione audit iniziale", () => {
  render(<App />);
  expect(
    screen.getByText(/Seleziona un audit per iniziare/i)
  ).toBeInTheDocument();
});
