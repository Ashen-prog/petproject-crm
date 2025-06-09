import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import App from './App';

test('renders login page by default', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  const welcome = screen.getByText(/добро пожаловать в CRM систему/i);
  expect(welcome).toBeInTheDocument();
});
