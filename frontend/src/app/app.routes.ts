import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Mascotas } from './components/mascotas/mascotas';
import { Vacunas } from './components/vacunas/vacunas';
import { Registros } from './components/registros/registros';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'mascotas', component: Mascotas, canActivate: [authGuard] },
  { path: 'vacunas', component: Vacunas, canActivate: [authGuard] },
  { path: 'registros', component: Registros, canActivate: [authGuard] }
];