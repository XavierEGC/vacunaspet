import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalMascotas = 0;
  totalVacunas = 0;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getMascotas().subscribe(d => {
      this.totalMascotas = d.length;
      this.cdr.detectChanges();
    });
    this.api.getVacunas().subscribe(d => {
      this.totalVacunas = d.length;
      this.cdr.detectChanges();
    });
  }
}