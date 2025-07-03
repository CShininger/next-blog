// API客户端 - 用于调用后端markdown服务
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export interface MarkdownDocument {
  _id: string;
  title: string;
  content: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  description?: string;
}

export interface CreateMarkdownRequest {
  title: string;
  content: string;
  fileName: string;
  tags?: string[];
  description?: string;
}

export interface MarkdownResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface MarkdownListResponse {
  success: boolean;
  message: string;
  data: {
    documents: MarkdownDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any;
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json() as T;
  }

  // 上传markdown文档
  async uploadMarkdown(data: CreateMarkdownRequest): Promise<MarkdownResponse> {
    return this.makeRequest<MarkdownResponse>('/markdowns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 获取所有markdown文档
  async getAllMarkdowns(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
  }): Promise<MarkdownListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tag) searchParams.set('tag', params.tag);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/markdowns?${queryString}` : '/markdowns';

    return this.makeRequest<MarkdownListResponse>(endpoint);
  }

  // 根据ID获取单个文档
  async getMarkdownById(id: string): Promise<MarkdownResponse> {
    return this.makeRequest<MarkdownResponse>(`/markdowns/${id}`);
  }

  // 更新markdown文档
  async updateMarkdown(
    id: string,
    data: Partial<CreateMarkdownRequest>
  ): Promise<MarkdownResponse> {
    return this.makeRequest<MarkdownResponse>(`/markdowns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 删除markdown文档
  async deleteMarkdown(id: string): Promise<MarkdownResponse> {
    return this.makeRequest<MarkdownResponse>(`/markdowns/${id}`, {
      method: 'DELETE',
    });
  }

  // 搜索markdown文档
  async searchMarkdowns(
    query: string,
    limit?: number
  ): Promise<MarkdownResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('query', query);
    if (limit) searchParams.set('limit', limit.toString());

    return this.makeRequest<MarkdownResponse>(
      `/markdowns/search?${searchParams.toString()}`
    );
  }
}

// 导出默认实例
export const apiClient = new ApiClient();
