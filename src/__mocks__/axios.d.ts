import { AxiosStatic } from 'axios';

declare module 'axios' {
  interface AxiosStatic {
    get: jest.MockedFunction<any> & {
      mockResolvedValue: jest.MockedFunction<any>;
      mockResolvedValueOnce: jest.MockedFunction<any>;
      mockRejectedValue: jest.MockedFunction<any>;
      mockRejectedValueOnce: jest.MockedFunction<any>;
    };
    post: jest.MockedFunction<any> & {
      mockResolvedValue: jest.MockedFunction<any>;
      mockResolvedValueOnce: jest.MockedFunction<any>;
      mockRejectedValue: jest.MockedFunction<any>;
      mockRejectedValueOnce: jest.MockedFunction<any>;
    };
    put: jest.MockedFunction<any> & {
      mockResolvedValue: jest.MockedFunction<any>;
      mockResolvedValueOnce: jest.MockedFunction<any>;
      mockRejectedValue: jest.MockedFunction<any>;
      mockRejectedValueOnce: jest.MockedFunction<any>;
    };
    delete: jest.MockedFunction<any> & {
      mockResolvedValue: jest.MockedFunction<any>;
      mockResolvedValueOnce: jest.MockedFunction<any>;
      mockRejectedValue: jest.MockedFunction<any>;
      mockRejectedValueOnce: jest.MockedFunction<any>;
    };
  }
}