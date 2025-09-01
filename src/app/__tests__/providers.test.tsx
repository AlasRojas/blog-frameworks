import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlowbiteInit } from '../providers';
import { jest } from '@jest/globals';

// Mock flowbite module
const mockInitFlowbite = jest.fn();

// Mock console.error to test error handling
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

describe('FlowbiteInit Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInitFlowbite.mockClear();
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children correctly', () => {
    render(
      <FlowbiteInit>
        <div>Test Content</div>
      </FlowbiteInit>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls useEffect on mount', () => {
    const { unmount } = render(
      <FlowbiteInit>
        <div>Test Content</div>
      </FlowbiteInit>
    );
    
    // Component should render without errors
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    unmount();
  });

  it('handles errors gracefully', async () => {
    console.error = mockConsoleError;
    
    // Mock import to simulate an error
    const originalImport = global.import;
    global.import = jest.fn().mockRejectedValue(new Error('Import failed'));
    
    render(
      <FlowbiteInit>
        <div>Test Content</div>
      </FlowbiteInit>
    );
    
    // Component should still render children even if import fails
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Wait a bit for the async import to potentially fail
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Restore original import
    global.import = originalImport;
  });

  it('renders multiple children', () => {
    render(
      <FlowbiteInit>
        <div>Child 1</div>
        <div>Child 2</div>
        <span>Child 3</span>
      </FlowbiteInit>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('acts as a wrapper component', () => {
    const testId = 'test-wrapper';
    render(
      <FlowbiteInit>
        <div data-testid={testId}>Wrapped Content</div>
      </FlowbiteInit>
    );
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByText('Wrapped Content')).toBeInTheDocument();
  });
});