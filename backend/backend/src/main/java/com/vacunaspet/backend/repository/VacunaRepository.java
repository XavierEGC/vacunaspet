package com.vacunaspet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vacunaspet.backend.model.Vacuna;

public interface VacunaRepository extends JpaRepository<Vacuna, Long> {
}