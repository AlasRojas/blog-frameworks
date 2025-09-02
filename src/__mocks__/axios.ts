const mockAxios: any = {
  get: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(function() { return mockAxios; }),
  defaults: {
    adapter: {},
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

// Ensure all HTTP methods have Jest mock capabilities
mockAxios.get.mockResolvedValue = jest.fn();
mockAxios.get.mockResolvedValueOnce = jest.fn();
mockAxios.get.mockRejectedValue = jest.fn();
mockAxios.get.mockRejectedValueOnce = jest.fn();

mockAxios.post.mockResolvedValue = jest.fn();
mockAxios.post.mockResolvedValueOnce = jest.fn();
mockAxios.post.mockRejectedValue = jest.fn();
mockAxios.post.mockRejectedValueOnce = jest.fn();

mockAxios.put.mockResolvedValue = jest.fn();
mockAxios.put.mockResolvedValueOnce = jest.fn();
mockAxios.put.mockRejectedValue = jest.fn();
mockAxios.put.mockRejectedValueOnce = jest.fn();

mockAxios.delete.mockResolvedValue = jest.fn();
mockAxios.delete.mockResolvedValueOnce = jest.fn();
mockAxios.delete.mockRejectedValue = jest.fn();
mockAxios.delete.mockRejectedValueOnce = jest.fn();

export default mockAxios;