import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders header with title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/SIPROD/i);
    expect(titleElement).toBeInTheDocument();
  });
});
