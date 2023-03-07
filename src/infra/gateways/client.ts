import { HttpRequest, HttpResponse } from '@/application/helpers'

export interface HttpGetClient {
  get: <T = any>(params: HttpGetClient.Input) => Promise<HttpGetClient.Output<T>>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params?: object
  }
  export type Output<T, H = any> = HttpResponse<T, H>
}

export interface HttpPostClient {
  post: <T = any>(params: HttpPostClient.Input) => Promise<HttpPostClient.Output<T>>
}

export namespace HttpPostClient {
  export type Input = HttpRequest
  export type Output<T, H = any> = HttpResponse<T, H>
}

export interface HttpPutClient {
  put: <T = any>(params: HttpPutClient.Input) => Promise<HttpPutClient.Output<T>>
}

export namespace HttpPutClient {
  export type Input = HttpRequest
  export type Output<T, H = any> = HttpResponse<T, H>
}
