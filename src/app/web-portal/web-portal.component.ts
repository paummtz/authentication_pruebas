import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// IMPORTACIÓN COMPONENTE POR COMPONENTE (Regla Standalone)
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthStateService, ValidacionDB } from '../services/auth-state';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';

// Importamos los íconos específicos que utiliza tu HTML
import { 
  lockClosedOutline, 
  qrCodeOutline, 
  appsOutline, 
  cameraOutline, 
  qrCode, 
  trash 
} from 'ionicons/icons'; 

@Component({
  selector: 'app-web-portal',
  standalone: true,
  // Agregamos las importaciones individuales exactas aquí
  imports: [
    CommonModule, 
    IonContent, 
    IonIcon, 
    QRCodeComponent, 
    DatePipe, 
    RouterModule
  ],
  templateUrl: './web-portal.component.html',
  styleUrls: ['./web-portal.component.scss']
})
export class WebPortalComponent implements OnInit {
  authState = inject(AuthStateService);
  
  servicio = signal('');
  cuenta = signal('');
  ultimoQrGenerado = signal<string | null>(null);
  pinIngresado = signal(''); 

  esFormularioValido = computed(() => this.servicio().length > 0 && this.cuenta().length > 0);

  constructor() {
    // Registramos los íconos en memoria para el renderizado nativo
    addIcons({ 
      lockClosedOutline, 
      qrCodeOutline, 
      appsOutline, 
      cameraOutline, 
      qrCode, 
      trash 
    });
  }

  ngOnInit() {
    this.authState.fetchRequests();
  }

  generarQR() {
    const pinGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    this.ultimoQrGenerado.set(pinGenerado);
    this.authState.createRequest(this.servicio(), this.cuenta(), pinGenerado);
    
    this.servicio.set('');
    this.cuenta.set('');
  }

  validarPin(req: ValidacionDB) {
    if (this.pinIngresado() === req.pin) {
      this.authState.updateStatus(req._id!, 'Aceptado');
      this.pinIngresado.set(''); 
      alert('¡Validación exitosa!');
    } else {
      alert('PIN incorrecto. Intenta de nuevo.');
    }
  }

  revocar(id: string) {
    if (id) {
      this.authState.updateStatus(id, 'Revocado');
    }
  }
}