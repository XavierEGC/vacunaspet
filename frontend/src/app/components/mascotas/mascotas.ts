import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Mascota } from '../../services/api';

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.scss'
})
export class Mascotas implements OnInit {
  mascotas: Mascota[] = [];
  nueva: Mascota = { nombre: '', especie: 'perro', raza: '', fechaNacimiento: '' };
  mensaje = '';

  razasPorEspecie: any = {
    perro: ['Labrador', 'Golden Retriever', 'Bulldog', 'Bulldog Francés', 'Pastor Alemán',
            'Beagle', 'Poodle', 'Chihuahua', 'Husky Siberiano', 'Shih Tzu',
            'Yorkshire Terrier', 'Dachshund', 'Boxer', 'Rottweiler', 'Doberman',
            'Pitbull', 'Border Collie', 'Cocker Spaniel', 'Schnauzer', 'Mestizo'],
    gato: ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Ragdoll',
           'British Shorthair', 'Sphynx', 'Abisinio', 'Scottish Fold',
           'Angora', 'Birmano', 'Noruego del Bosque', 'Mestizo'],
    conejo: ['Holandés', 'Angora', 'Rex', 'Lop Inglés', 'Lop Holandés',
             'Mini Rex', 'Lionhead', 'Belier', 'Californiano', 'Mestizo'],
    ave: ['Periquito', 'Canario', 'Loro Amazónico', 'Loro Africano',
          'Cacatúa', 'Agaporni', 'Ninfa', 'Guacamayo', 'Cotorra', 'Diamante'],
    hamster: ['Sirio Dorado', 'Ruso Enano', 'Roborovski', 'Chino', 'Campbell'],
    cobaya: ['Inglés', 'Peruviano', 'Teddy', 'Abisinio', 'Coronet'],
    tortuga: ['Mediterránea', 'Rusa', 'Mapa', 'Orejas Rojas', 'Caja'],
    pez: ['Goldfish', 'Betta', 'Guppy', 'Molly', 'Tetra Neón', 'Disco', 'Ángel'],
    reptil: ['Dragón Barbudo', 'Gecko Leopardo', 'Iguana Verde', 'Camaleón', 'Tortuga Acuática'],
    otro: ['Mestizo', 'Otro']
  };

  get razas(): string[] {
    return this.razasPorEspecie[this.nueva.especie] || ['Mestizo'];
  }

  onEspecieChange() {
    this.nueva.raza = this.razas[0];
  }

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.api.getMascotas().subscribe(data => {
      this.mascotas = [...data];
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.api.crearMascota(this.nueva).subscribe(() => {
      this.mensaje = '✅ Mascota registrada correctamente';
      this.nueva = { nombre: '', especie: 'perro', raza: '', fechaNacimiento: '' };
      this.cargar();
      setTimeout(() => this.mensaje = '', 3000);
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta mascota?')) {
      this.api.eliminarMascota(id).subscribe(() => this.cargar());
    }
  }

  getEmoji(especie: string): string {
    const emojis: any = {
      perro: '🐕', gato: '🐈', conejo: '🐇', ave: '🦜',
      hamster: '🐹', cobaya: '🐾', tortuga: '🐢', pez: '🐟',
      reptil: '🦎', otro: '🐾'
    };
    return emojis[especie] || '🐾';
  }
}