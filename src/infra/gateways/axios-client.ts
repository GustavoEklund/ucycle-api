import { HttpGetClient, HttpPutClient, HttpPostClient } from '@/infra/gateways/client'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient, HttpPostClient, HttpPutClient {
  private static async request<T, H = any>({
    url,
    method,
    body,
    headers,
  }: {
    url: string
    method: 'GET' | 'POST' | 'PUT'
    body?: any
    headers?: any
  }): Promise<{ data: T; headers: H; statusCode: number; error?: Error }> {
    try {
      const result = await axios({
        url,
        method,
        data: body,
        headers,
      })
      return {
        data: result.data,
        statusCode: result.status,
        headers: result.headers as any,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: error!.response?.data,
          headers: error!.response?.headers as any,
          statusCode: error!.response?.status ?? 500,
          error: error,
        }
      }
      throw error
    }
  }

  async get({ url, params }: HttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }

  public async post<T>({
    url,
    body,
    headers,
  }: HttpPostClient.Input): Promise<HttpPostClient.Output<T>> {
    return await AxiosHttpClient.request<T>({
      url,
      method: 'POST',
      body,
      headers,
    })
  }

  public async put<T>({
    url,
    body,
    headers,
  }: HttpPostClient.Input): Promise<HttpPutClient.Output<T>> {
    return await AxiosHttpClient.request<T>({
      url,
      method: 'PUT',
      body,
      headers,
    })
  }
}
