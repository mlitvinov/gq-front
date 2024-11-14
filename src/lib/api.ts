import { initData } from "@telegram-apps/sdk-react";
import { BASE_URL } from "./const";

interface CustomFetchOptions extends RequestInit {
  headers?: HeadersInit;
  // Добавьте другие кастомные опции, если необходимо
}
/*
export async function api<T = any>(url: string, options: CustomFetchOptions = {}, initDataRaw?: string): Promise<T> {
  const _initData = initData.raw() ?? initDataRaw;

  if (!_initData) {
    throw new Error("initData is not defined");
  }
  // Определяем стандартные заголовки
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    initData: _initData,
  };

  // Объединяем стандартные заголовки с заголовками из options
  const mergedHeaders: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Создаём новый объект опций, объединяя стандартные и пользовательские опции
  const mergedOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  // Выполняем запрос с использованием fetch
  const response = await fetch(url, mergedOptions);

  // Проверяем, успешен ли ответ
  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    // Можно расширить обработку ошибок по необходимости
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Предполагаем, что ответ в формате JSON
  const data: T = await response.json();
  return data;
} */

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Устанавливаем базовый URL при создании экземпляра
    this.baseUrl = baseUrl;
  }

  // Основной метод для выполнения запросов
  private async api<T = any>(endpoint: string, options: CustomFetchOptions = {}, initDataRaw?: string): Promise<T> {
    const _initData = initData.raw() ?? initDataRaw;

    if (!_initData) {
      throw new Error("initData is not defined");
    }

    // Определяем стандартные заголовки
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      initData: _initData,
    };

    // Объединяем стандартные заголовки с заголовками из options
    const mergedHeaders: HeadersInit = {
      ...defaultHeaders,
      ...(options.headers || {}),
    };

    // Создаём новый объект опций, объединяя стандартные и пользовательские опции
    const mergedOptions: RequestInit = {
      ...options,
      headers: mergedHeaders,
    };

    // Формируем полный URL
    const url = `${this.baseUrl}${endpoint}`;

    // Выполняем запрос с использованием fetch
    const response = await fetch(url, mergedOptions);

    // Проверяем, успешен ли ответ
    if (!response.ok) {
      // Можно расширить обработку ошибок по необходимости
      console.error(`HTTP error! status: ${response.status}`);
      throw response;
    }

    // Предполагаем, что ответ в формате JSON
    const data: T = await response.json();
    return data;
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
        body: JSON.stringify(body),
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
        body: JSON.stringify(body),
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
        body: JSON.stringify(body),
      },
      initDataRaw
    );
  }

  public HEAD<T = any>(endpoint: string, initDataRaw?: string): Promise<T> {
    return this.api<T>(endpoint, { method: "HEAD" }, initDataRaw);
  }
}

export const api = new ApiClient(BASE_URL);
