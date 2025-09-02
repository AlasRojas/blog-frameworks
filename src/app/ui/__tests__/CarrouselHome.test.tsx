import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CarouselHome } from '../CarrouselHome'

// Mock flowbite-react Carousel component
vi.mock('flowbite-react', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-mock">{children}</div>
  ),
}))

describe('CarouselHome', () => {
  it('renders without crashing', () => {
    render(<CarouselHome />)
    expect(screen.getByTestId('carousel-mock')).toBeInTheDocument()
  })

  it('displays Angular framework slide', () => {
    render(<CarouselHome />)
    expect(screen.getByText('Angular')).toBeInTheDocument()
  })

  it('displays React framework slide', () => {
    render(<CarouselHome />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('displays Vue framework slide', () => {
    render(<CarouselHome />)
    expect(screen.getByText('Vue')).toBeInTheDocument()
  })

  it('has correct CSS classes for container', () => {
    render(<CarouselHome />)
    const container = screen.getByTestId('carousel-mock').parentElement
    expect(container).toHaveClass('relative', 'h-56', 'sm:h-64', 'xl:h-80', '2xl:h-96', 'rounded-lg')
  })

  it('displays framework icons with correct classes', () => {
    render(<CarouselHome />)
    
    // Check for Angular icon
    const angularIcon = document.querySelector('.fab.fa-angular')
    expect(angularIcon).toBeInTheDocument()
    expect(angularIcon).toHaveClass('text-6xl', 'text-white')
    
    // Check for React icon
    const reactIcon = document.querySelector('.fab.fa-react')
    expect(reactIcon).toBeInTheDocument()
    expect(reactIcon).toHaveClass('text-6xl', 'text-white')
    
    // Check for Vue icon
    const vueIcon = document.querySelector('.fab.fa-vuejs')
    expect(vueIcon).toBeInTheDocument()
    expect(vueIcon).toHaveClass('text-6xl', 'text-white')
  })

  it('has correct gradient backgrounds for each slide', () => {
    render(<CarouselHome />)
    
    // Angular slide - red gradient
    const angularSlide = screen.getByText('Angular').closest('.bg-gradient-to-r')
    expect(angularSlide).toHaveClass('bg-gradient-to-r', 'from-red-600', 'to-red-400')
    
    // React slide - blue gradient
    const reactSlide = screen.getByText('React').closest('.bg-gradient-to-r')
    expect(reactSlide).toHaveClass('bg-gradient-to-r', 'from-cyan-400', 'to-blue-500')
    
    // Vue slide - green gradient
    const vueSlide = screen.getByText('Vue').closest('.bg-gradient-to-r')
    expect(vueSlide).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-green-600')
  })
})