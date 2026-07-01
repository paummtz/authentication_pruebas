import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTACIÓN MODERNA: Traemos cada componente con sus estilos nativos
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonButton, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  // Pasamos los componentes limpios aquí
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonToolbar, IonButtons, 
    IonBackButton, IonButton, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonIcon
  ]
})
export class ScannerComponent implements OnDestroy {

  public isScanning = signal(false);
  public scannedResult = signal<string | null>(null);

  constructor() {
    // Registramos el ícono de la cámara para que no salga vacío
    addIcons({ cameraOutline });
  }

  async startScan() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        alert('Se necesita permiso de la cámara para escanear.');
        return;
      }

      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      this.isScanning.set(true);
      this.scannedResult.set(null);

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scannedResult.set(result.content);
        this.stopScan();
      }
    } catch (error) {
      console.error('Error al usar el escáner:', error);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.isScanning.set(false);
  }

  ngOnDestroy() {
    this.stopScan();
  }
}