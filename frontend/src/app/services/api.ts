import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vacuna {
  id?: number;
  nombre: string;
  descripcion: string;
  fabricante: string;
  dosis: number;
}

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Auth
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/auth/login`, { username, password });
  }

  // Vacunas
  getVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.url}/vacunas`);
  }

  crearVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.url}/vacunas`, vacuna);
  }

  eliminarVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/vacunas/${id}`);
  }

  // Mascotas
  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.url}/mascotas`);
  }

  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.url}/mascotas`, mascota);
  }

  eliminarMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/mascotas/${id}`);
  }
  // Registros
  getRegistros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/registros`);
  }

  crearRegistro(registro: any): Observable<any> {
    return this.http.post<any>(`${this.url}/registros`, registro);
  }

  eliminarRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/registros/${id}`);
  }
}