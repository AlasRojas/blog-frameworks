import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlowbiteInit } from '../providers';
import { jest } from '@jest/globals';

// Mock flowbite module
jest.mock('flowbite', () => ({
  initFlowbite: jest.fn(),
}));

describe('FlowbiteInit Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <FlowbiteInit>
        <div>Test Content</div>
      </FlowbiteInit>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    render(
      <FlowbiteInit>
        <div>Test Content</div>
      </FlowbiteInit>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
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