import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders color manager heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/color manager/i);
  expect(headingElement).toBeInTheDocument();
});
