package com.vacunaspet.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vacunaspet.backend.model.RegistroVacuna;
import com.vacunaspet.backend.repository.RegistroVacunaRepository;

@RestController
@RequestMapping("/api/registros")
@CrossOrigin(origins = "http://localhost:4200")
public class RegistroVacunaController {

    @Autowired
    private RegistroVacunaRepository registroRepository;

    @GetMapping
    public List<RegistroVacuna> listar() {
        return registroRepository.findAll();
    }

    @GetMapping("/mascota/{mascotaId}")
    public List<RegistroVacuna> porMascota(@PathVariable Long mascotaId) {
        return registroRepository.findByMascotaId(mascotaId);
    }

    @PostMapping
    public RegistroVacuna crear(@RequestBody RegistroVacuna registro) {
        return registroRepository.save(registro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return registroRepository.findById(id).map(r -> {
            registroRepository.delete(r);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}