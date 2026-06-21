package com.vacunaspet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vacunaspet.backend.model.RegistroVacuna;

public interface RegistroVacunaRepository extends JpaRepository<RegistroVacuna, Long> {
    List<RegistroVacuna> findByMascotaId(Long mascotaId);
}