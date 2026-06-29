import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  // ESTO FALTABA: Importar IonicModule para que Angular entienda el HTML
  imports: [CommonModule, IonicModule]
})
export class ScannerComponent implements OnDestroy {

  // Variables reactivas (Signals) que tu HTML necesita leer
  public isScanning = signal(false);
  public scannedResult = signal<string | null>(null);

  async startScan() {
    try {
      // 1. Pedimos permiso para usar la cámara
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        alert('Se necesita permiso de la cámara para escanear.');
        return;
      }

      // 2. Preparamos la pantalla transparente para ver la cámara
      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      this.isScanning.set(true);
      this.scannedResult.set(null); // Limpiamos escaneos anteriores

      // 3. ¡Iniciamos el escáner!
      const result = await BarcodeScanner.startScan();

      // 4. Si detectamos un código QR...
      if (result.hasContent) {
        this.scannedResult.set(result.content); // Lo guardamos
        this.stopScan(); // Apagamos la cámara
      }
    } catch (error) {
      console.error('Error al usar el escáner:', error);
      this.stopScan();
    }
  }

  stopScan() {
    // Restauramos el fondo blanco normal y apagamos la cámara
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.isScanning.set(false);
  }

  ngOnDestroy() {
    // Si el usuario sale de la página por accidente, apagamos la cámara
    this.stopScan();
  }
}