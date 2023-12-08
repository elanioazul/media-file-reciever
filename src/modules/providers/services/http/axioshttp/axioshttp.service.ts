import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders, AxiosRequestConfig, HeadersDefaults } from 'axios';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
//import { AxiosResponse } from 'axios';
//import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class AxioshttpService {
  constructor(private readonly httpService: HttpService) {}

  //nestjs-axios
  doNestsAxiosGet(
    baseUrl: string,
    endpoint: string,
    params?: any,
  ): Observable<any> {
    const url = baseUrl + endpoint;

    return this.httpService.get(url, { params }).pipe(
      map((response: any) => response.data),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  doNestAxiosPost(
    baseUrl: string,
    endpoint: string,
    data: FormData,
    headers: any,
  ): Observable<any> {
    const url = baseUrl + endpoint;

    return this.httpService.post(url, data, headers).pipe(
      map((response: any) => response.data),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  //axios way
  // async get(method: any, params: any) {
  //   try {
  //     const response = await axios.get(`/${method}`, {
  //       baseURL: BASE_URL,
  //       params: params,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async post(method: any, data: any) {
  //   try {
  //     const response = await axios({
  //       method: 'post',
  //       baseURL: BASE_URL,
  //       url: `/${method}`,
  //       data,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
