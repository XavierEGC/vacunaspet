package com.vacunaspet.backend.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "registros_vacuna")
public class RegistroVacuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnoreProperties({"propietario", "hibernateLazyInitializer"})
    private Mascota mascota;

    @ManyToOne
    @JoinColumn(name = "vacuna_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Vacuna vacuna;

    @Column(nullable = false)
    private LocalDate fechaAplicacion;

    private LocalDate fechaProxima;

    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "veterinario_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer"})
    private Usuario veterinario;
}