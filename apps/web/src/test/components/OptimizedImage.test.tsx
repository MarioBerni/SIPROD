import { render, screen } from '@testing-library/react';
import { OptimizedImage } from '../../utils/imageOptimization';

describe('OptimizedImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test Image',
    width: 300,
    height: 200,
  };

  it('renders image with correct attributes', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '200');
  });

  it('includes WebP and AVIF sources', () => {
    const { container } = render(<OptimizedImage {...defaultProps} />);
    
    const sources = container.getElementsByTagName('source');
    expect(sources).toHaveLength(2);
    
    // Acceder a los elementos individualmente
    const avif = sources[0];
    const webp = sources[1];
    
    expect(avif).toHaveAttribute('type', 'image/avif');
    expect(webp).toHaveAttribute('type', 'image/webp');
  });

  it('sets loading attribute based on priority', () => {
    const { rerender } = render(<OptimizedImage {...defaultProps} priority={true} />);
    
    let img = screen.getByAltText('Test Image');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('decoding', 'sync');

    rerender(<OptimizedImage {...defaultProps} priority={false} />);
    img = screen.getByAltText('Test Image');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);
    
    const picture = screen.getByRole('img').parentElement;
    expect(picture).toHaveClass('custom-class');
  });
});
