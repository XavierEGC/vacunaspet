import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Mascota, Vacuna } from '../../services/api';

@Component({
  selector: 'app-registros',
  imports: [CommonModule, FormsModule],
  templateUrl: './registros.html',
  styleUrl: './registros.scss'
})
export class Registros implements OnInit {
  registros: any[] = [];
  mascotas: Mascota[] = [];
  vacunas: Vacuna[] = [];
  vacunasFiltradas: Vacuna[] = [];
  nuevo: any = { mascota: null, vacuna: null, fechaAplicacion: '', fechaProxima: '', observaciones: '' };
  mensaje = '';
  cargando = true;

  // Meses hasta próxima dosis por vacuna
  proximaDosis: any = {
    'Rabia': 12,
    'Parvovirus': 1,
    'Moquillo': 1,
    'Triple Felina': 6,
    'Leptospirosis': 6,
    'Bordetella': 12,
    'Hepatitis': 6,
    'Coronavirus Canino': 6,
    'Leucemia Felina': 12,
    'FVRCP': 1,
    'Polivalente Canina': 1,
    'Giardia': 6,
    'Myxomatosis': 12,
    'VHD Conejo': 12,
    'Influenza Aviar': 12,
  };

  // Vacunas compatibles por especie
  vacunasPorEspecie: any = {
    perro: ['Rabia', 'Parvovirus', 'Moquillo', 'Leptospirosis', 'Bordetella', 'Hepatitis', 'Coronavirus Canino', 'Polivalente Canina', 'Giardia'],
    gato: ['Rabia', 'Triple Felina', 'Leucemia Felina', 'FVRCP'],
    conejo: ['Myxomatosis', 'VHD Conejo'],
    ave: ['Influenza Aviar'],
    hamster: [],
    cobaya: [],
    tortuga: [],
    pez: [],
    reptil: [],
    otro: []
  };

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
    this.api.getMascotas().subscribe(d => { this.mascotas = d; this.cdr.detectChanges(); });
    this.api.getVacunas().subscribe(d => {
      this.vacunas = d;
      this.vacunasFiltradas = d;
      this.cdr.detectChanges();
    });
  }

  onMascotaChange() {
    this.nuevo.vacuna = null;
    const mascota = this.mascotas.find(m => m.id === this.nuevo.mascota);
    if (mascota) {
      const compatibles = this.vacunasPorEspecie[mascota.especie] || [];
      this.vacunasFiltradas = compatibles.length > 0
        ? this.vacunas.filter(v => compatibles.includes(v.nombre))
        : this.vacunas;
    } else {
      this.vacunasFiltradas = this.vacunas;
    }
    this.cdr.detectChanges();
  }

  onVacunaChange() {
    const vacuna = this.vacunas.find(v => v.id === this.nuevo.vacuna);
    if (vacuna && this.nuevo.fechaAplicacion) {
      const meses = this.proximaDosis[vacuna.nombre] || 12;
      const fecha = new Date(this.nuevo.fechaAplicacion);
      fecha.setMonth(fecha.getMonth() + meses);
      this.nuevo.fechaProxima = fecha.toISOString().split('T')[0];
      this.cdr.detectChanges();
    }
  }

  onFechaAplicacionChange() {
    this.onVacunaChange();
  }

  cargar() {
    this.cargando = true;
    this.api.getRegistros().subscribe(d => {
      this.registros = [...d];
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    const data = {
      mascota: { id: this.nuevo.mascota },
      vacuna: { id: this.nuevo.vacuna },
      fechaAplicacion: this.nuevo.fechaAplicacion,
      fechaProxima: this.nuevo.fechaProxima,
      observaciones: this.nuevo.observaciones
    };
    this.api.crearRegistro(data).subscribe(() => {
      this.mensaje = '✅ Registro creado correctamente';
      this.nuevo = { mascota: null, vacuna: null, fechaAplicacion: '', fechaProxima: '', observaciones: '' };
      this.vacunasFiltradas = this.vacunas;
      this.cargar();
      setTimeout(() => this.mensaje = '', 3000);
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.api.eliminarRegistro(id).subscribe(() => this.cargar());
    }
  }
}