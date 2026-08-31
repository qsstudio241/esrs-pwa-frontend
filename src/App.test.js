import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders audit selector', () => {
  render(<App />);
  const selectorElement = screen.getByText(/Seleziona audit/i);
  expect(selectorElement).toBeInTheDocument();
});
