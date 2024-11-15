import { initData } from "@telegram-apps/sdk-react";
import { BASE_URL } from "./const";

interface CustomFetchOptions extends RequestInit {
  headers?: HeadersInit;
  // Добавьте другие кастомные опции, если необходимо
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Устанавливаем базовый URL при создании экземпляра
    this.baseUrl = baseUrl;
  }

  // Основной метод для выполнения запросов
  private async api<T = any>(endpoint: string, options: CustomFetchOptions = {}, initDataRaw?: string): Promise<T | void> {
    const _initData = initDataRaw ? initDataRaw : initData.raw();

    if (!_initData) {
      throw new Error("initData is not defined");
    }

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      initData: _initData,
    };

    const mergedHeaders: HeadersInit = {
      ...defaultHeaders,
      ...(options.headers || {}),
    };

    const mergedOptions: RequestInit = {
      ...options,
      headers: mergedHeaders,
    };

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw response;
    }

    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      try {
        const data: T = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        throw new Error("Invalid JSON response");
      }
    } else if (contentType.includes("text/plain")) {
      const textData = await response.text();
      try {
        const data: T = JSON.parse(textData);
        return data;
      } catch {
        return textData as unknown as T;
      }
    } else if (contentType.includes("application/octet-stream")) {
      return (await response.arrayBuffer()) as unknown as T;
    } else if (contentType.includes("image/") || contentType.includes("video/")) {
      return (await response.blob()) as unknown as T;
    } else {
      console.warn(`Unhandled content type: ${contentType}`);
      // Возвращаем void для успешных, но нераспознанных ответов
      return undefined;
    }
  }

  // Метод GET
  public get<T = any>(endpoint: string, params?: Record<string, any>, initDataRaw?: string): Promise<T> {
    // Если есть параметры, добавляем их к URL
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return this.api<T>(`${endpoint}${queryString}`, { method: "GET" }, initDataRaw);
  }

  // Метод POST
  public post<T = any>(endpoint: string, body?: any, initDataRaw?: string): Promise<T> {
    return this.api<T>(
      endpoint,
      {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      initDataRaw
    );
  }

  // Метод PUT
  public put<T = any>(endpoint: string, body?: any, initDataRaw?: string): Promise<T> {
    return this.api<T>(
      endpoint,
      {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      },
      initDataRaw
    );
  }

  // Метод DELETE
  public delete<T = any>(endpoint: string, initDataRaw?: string): Promise<T> {
    return this.api<T>(endpoint, { method: "DELETE" }, initDataRaw);
  }

  public PATCH<T = any>(endpoint: string, body?: any, initDataRaw?: string): Promise<T> {
    return this.api<T>(
      endpoint,
      {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      },
      initDataRaw
    );
  }

  public HEAD<T = any>(endpoint: string, initDataRaw?: string): Promise<T> {
    return this.api<T>(endpoint, { method: "HEAD" }, initDataRaw);
  }
}

export const api = new ApiClient(BASE_URL);
