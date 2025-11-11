import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Home from "../../app/page";

test("renders input and fetch button", () => {
  render(<Home />);
  expect(screen.getByPlaceholderText("Enter Bitcoin address")).toBeInTheDocument();
  expect(screen.getByText("Fetch")).toBeInTheDocument();
});

test("shows loading spinner and logs", async () => {
  render(<Home />);
  fireEvent.change(screen.getByPlaceholderText("Enter Bitcoin address"), {
    target: { value: "testaddress" },
  });
  fireEvent.click(screen.getByText("Fetch"));
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
});

test("error boundary retry works", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("API error"))) as jest.Mock;

  render(<Home />);
  fireEvent.click(screen.getByText("Fetch"));

  await waitFor(async () => {
    expect(await screen.findByText("Retry")).toBeInTheDocument();
  });
});
