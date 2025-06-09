import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import React from 'react';
jest.mock('react-router-dom', () => ({
  NavLink: ({ children, to }) => <a href={to}>{children}</a>,
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Navigate: () => null,
}), { virtual: true });

test('shows demo button when user is not authenticated', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const demoButton = screen.getByRole('button', { name: /демо-режим/i });
  expect(demoButton).toBeInTheDocument();
});
