// 后端服务基础URL
const BACKEND_API_BASE =
  process.env.BACKEND_API_URL || 'http://localhost:3001/api/v1';

// 后端API客户端
export const backendAPI = {
  // 用户登录
  login: async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response;
  },

  // 用户注册
  register: async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await fetch(`${BACKEND_API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  },

  // 获取当前用户信息
  me: async (token: string) => {
    const response = await fetch(`${BACKEND_API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  },

  // 用户注销
  logout: async (token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_API_BASE}/auth/logout`, {
      method: 'POST',
      headers,
    });

    return response;
  },
};
