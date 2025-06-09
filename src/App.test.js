import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

test('shows demo button when user is not authenticated', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const demoButton = screen.getByRole('button', { name: /демо-режим/i });
  expect(demoButton).toBeInTheDocument();
});
