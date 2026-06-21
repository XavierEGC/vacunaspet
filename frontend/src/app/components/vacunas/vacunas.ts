import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Vacuna } from '../../services/api';

@Component({
  selector: 'app-vacunas',
  imports: [CommonModule, FormsModule],
  templateUrl: './vacunas.html',
  styleUrl: './vacunas.scss'
})
export class Vacunas implements OnInit {
  vacunas: Vacuna[] = [];
  nueva: Vacuna = { nombre: '', descripcion: '', fabricante: '', dosis: 1 };
  mensaje = '';
  modoManual = false;

  catalogo: any[] = [
    { nombre: 'Rabia', fabricante: 'Zoetis', dosis: 1, descripcion: 'Vacuna antirrábica anual obligatoria para perros y gatos' },
    { nombre: 'Parvovirus', fabricante: 'MSD', dosis: 3, descripcion: 'Protección contra parvovirus canino, altamente contagioso' },
    { nombre: 'Moquillo', fabricante: 'Boehringer', dosis: 3, descripcion: 'Vacuna contra el moquillo canino (distemper)' },
    { nombre: 'Triple Felina', fabricante: 'Virbac', dosis: 2, descripcion: 'Protección contra rinotraqueítis, calicivirus y panleucopenia felina' },
    { nombre: 'Leptospirosis', fabricante: 'Zoetis', dosis: 2, descripcion: 'Vacuna contra leptospira, zoonosis transmisible al humano' },
    { nombre: 'Bordetella', fabricante: 'MSD', dosis: 1, descripcion: 'Tos de las perreras, recomendada para perros en contacto con otros' },
    { nombre: 'Hepatitis', fabricante: 'Virbac', dosis: 2, descripcion: 'Hepatitis infecciosa canina causada por adenovirus' },
    { nombre: 'Coronavirus Canino', fabricante: 'Zoetis', dosis: 2, descripcion: 'Protección contra coronavirus gastrointestinal canino' },
    { nombre: 'Leucemia Felina', fabricante: 'Boehringer', dosis: 2, descripcion: 'Prevención de leucemia viral felina (FeLV)' },
    { nombre: 'FVRCP', fabricante: 'Zoetis', dosis: 3, descripcion: 'Vacuna combinada felina: rinotraqueítis, calicivirus y panleucopenia' },
    { nombre: 'Polivalente Canina', fabricante: 'MSD', dosis: 3, descripcion: 'Vacuna 7 en 1: moquillo, hepatitis, parvovirus, parainfluenza, leptospira' },
    { nombre: 'Giardia', fabricante: 'Zoetis', dosis: 2, descripcion: 'Vacuna contra giardia lamblia en perros' },
    { nombre: 'Myxomatosis', fabricante: 'Hipra', dosis: 1, descripcion: 'Protección contra myxomatosis en conejos' },
    { nombre: 'VHD Conejo', fabricante: 'Hipra', dosis: 1, descripcion: 'Enfermedad hemorrágica viral del conejo' },
    { nombre: 'Influenza Aviar', fabricante: 'Ceva', dosis: 1, descripcion: 'Vacuna contra influenza aviar para aves de compañía' },
  ];

  get nombresDisponibles(): string[] {
    return this.catalogo.map(v => v.nombre);
  }

  onNombreChange() {
    if (this.modoManual) return;
    const found = this.catalogo.find(v => v.nombre === this.nueva.nombre);
    if (found) {
      this.nueva.fabricante = found.fabricante;
      this.nueva.dosis = found.dosis;
      this.nueva.descripcion = found.descripcion;
    }
  }

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.api.getVacunas().subscribe(data => {
      this.vacunas = [...data];
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.api.crearVacuna(this.nueva).subscribe(() => {
      this.mensaje = '✅ Vacuna registrada correctamente';
      this.nueva = { nombre: '', descripcion: '', fabricante: '', dosis: 1 };
      this.modoManual = false;
      this.cargar();
      setTimeout(() => this.mensaje = '', 3000);
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta vacuna?')) {
      this.api.eliminarVacuna(id).subscribe(() => this.cargar());
    }
  }
}