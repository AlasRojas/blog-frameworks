declare module 'axios' {
  interface AxiosStatic {
    get: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> & {
      mockResolvedValue: jest.MockedFunction<(value: unknown) => void>;
      mockResolvedValueOnce: jest.MockedFunction<(value: unknown) => void>;
      mockRejectedValue: jest.MockedFunction<(reason: unknown) => void>;
      mockRejectedValueOnce: jest.MockedFunction<(reason: unknown) => void>;
    };
    post: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> & {
      mockResolvedValue: jest.MockedFunction<(value: unknown) => void>;
      mockResolvedValueOnce: jest.MockedFunction<(value: unknown) => void>;
      mockRejectedValue: jest.MockedFunction<(reason: unknown) => void>;
      mockRejectedValueOnce: jest.MockedFunction<(reason: unknown) => void>;
    };
    put: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> & {
      mockResolvedValue: jest.MockedFunction<(value: unknown) => void>;
      mockResolvedValueOnce: jest.MockedFunction<(value: unknown) => void>;
      mockRejectedValue: jest.MockedFunction<(reason: unknown) => void>;
      mockRejectedValueOnce: jest.MockedFunction<(reason: unknown) => void>;
    };
    delete: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> & {
      mockResolvedValue: jest.MockedFunction<(value: unknown) => void>;
      mockResolvedValueOnce: jest.MockedFunction<(value: unknown) => void>;
      mockRejectedValue: jest.MockedFunction<(reason: unknown) => void>;
      mockRejectedValueOnce: jest.MockedFunction<(reason: unknown) => void>;
    };
  }
}