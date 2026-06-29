import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ValidacionDB {
  _id?: string;
  servicio: string;
  cuenta: string;
  estado: 'Pendiente' | 'Aceptado' | 'Revocado';
  hora_fecha: Date;
  pin: string; 
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private http = inject(HttpClient);
  // Tu URL base de Vercel (asegúrate de que termine en /)
  private apiUrl = 'https://api-auth-lemon.vercel.app/'; 

  // Mantenemos la lista en un Signal para que la UI reaccione automáticamente
  public requests = signal<ValidacionDB[]>([]);

  // 1. Obtener todas las solicitudes de Mongo
  async fetchRequests() {
    try {
      // Esperamos el arreglo directo (ValidacionDB[]) que devuelve tu Vercel
      const data = await firstValueFrom(this.http.get<ValidacionDB[]>(`${this.apiUrl}api/validacion`));
      
      if (data) {
        this.requests.set(data);
      }
    } catch (error) {
      console.error('Error al obtener datos de las validaciones', error);
    }
  }

  // 2. Crear nueva solicitud (POST)
  async createRequest(servicio: string, cuenta: string, pin: string) {
    const nuevaValidacion = {
      servicio,
      cuenta,
      estado: 'Pendiente',
      hora_fecha: new Date(),
      pin
    };
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}api/validacion`, nuevaValidacion));
      this.fetchRequests(); // Recargamos la lista automáticamente
    } catch (error) {
      console.error('Error al guardar en la BD', error);
    }
  }

  // 3. Actualizar estado (PUT) para Aceptar o Revocar
  async updateStatus(id: string, nuevoEstado: 'Aceptado' | 'Revocado') {
    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}api/validacion/${id}`, { estado: nuevoEstado }));
      this.fetchRequests(); // Recargamos la lista para ver el cambio reflejado
    } catch (error) {
      console.error('Error al actualizar el estado', error);
    }
  }
}