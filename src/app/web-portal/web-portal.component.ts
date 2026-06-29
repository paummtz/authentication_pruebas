import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthStateService, ValidacionDB } from '../services/auth-state';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';

// Importamos TODOS los íconos de Ionic para evitar errores de URL base inválida
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
  imports: [CommonModule, IonicModule, QRCodeComponent, DatePipe, RouterModule],
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
    // Registramos los íconos globalmente en memoria dentro del componente
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
    // Al cargar el componente traemos los registros desde MongoDB Atlas
    this.authState.fetchRequests();
  }

  generarQR() {
    // Generamos un PIN aleatorio de 6 dígitos
    const pinGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardamos el PIN actual en el signal para renderizar el QR en pantalla
    this.ultimoQrGenerado.set(pinGenerado);
    
    // Enviamos el registro a través del servicio a la Base de Datos
    this.authState.createRequest(this.servicio(), this.cuenta(), pinGenerado);
    
    // Limpiamos los inputs del formulario
    this.servicio.set('');
    this.cuenta.set('');
  }

  validarPin(req: ValidacionDB) {
    if (this.pinIngresado() === req.pin) {
      this.authState.updateStatus(req._id!, 'Aceptado');
      this.pinIngresado.set(''); // Limpiar input
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