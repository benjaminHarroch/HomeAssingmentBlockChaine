import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../../app/page";


test("renders input and fetch button", () => {
  render(<Home />);
  expect(screen.getByPlaceholderText(/enter bitcoin address/i)).toBeInTheDocument();
  expect(screen.getByText(/fetch/i)).toBeInTheDocument();
});


test("shows loading spinner while fetching", async () => {
  global.fetch = jest.fn(() =>
    new Promise(() => {}) // never resolves => נשאר במצב טעינה
  ) as jest.Mock;

  render(<Home />);
  fireEvent.change(screen.getByPlaceholderText(/enter bitcoin address/i), {
    target: { value: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT" },
  });
  fireEvent.click(screen.getByText(/fetch/i));

  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
});

test("shows retry when fetch fails", async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error("Network error"))
  ) as jest.Mock;

  render(<Home />);
  fireEvent.change(screen.getByPlaceholderText(/enter bitcoin address/i), {
    target: { value: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT" },
  });
  fireEvent.click(screen.getByText(/fetch/i));

  const retryBtn = await screen.findByText(/retry/i);
  expect(retryBtn).toBeInTheDocument();
});

test("shows graph after successful fetch", async () => {
  const mockData = {
    nodes: [
      { id: "1", label: "A" },
      { id: "2", label: "B" },
    ],
    links: [
      { nodeSource: "1", nodeTarget: "2", valueTransaction: 0.5 },
    ],
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
  ) as jest.Mock;

  render(<Home />);

  fireEvent.change(screen.getByPlaceholderText(/enter bitcoin address/i), {
    target: { value: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT" },
  });
  fireEvent.click(screen.getByText(/fetch/i));

  await waitFor(() => {
    const graph = screen.getByTestId("graph-container");
    expect(graph).toBeInTheDocument();
  });
});

test("real API returns data for Bitcoin address", async () => {
  const response = await fetch(
    "https://blockstream.info/api/address/1BoatSLRHtKNngkdXEeobR76b53LETtpyT/txs"
  );
  const data = await response.json();

  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toHaveProperty("txid");
});
