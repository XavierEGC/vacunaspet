package com.vacunaspet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vacunaspet.backend.model.Mascota;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByPropietarioId(Long propietarioId);
}