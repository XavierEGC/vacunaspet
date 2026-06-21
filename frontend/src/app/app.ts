import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'VacunasPet';
  mostrarSidebar = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.mostrarSidebar = !e.url.includes('/login') && e.url !== '/';
      this.cdr.detectChanges();
    });
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.mostrarSidebar = false;
    this.router.navigate(['/login']);
  }
}