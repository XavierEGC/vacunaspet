package com.vacunaspet.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vacunaspet.backend.model.Vacuna;
import com.vacunaspet.backend.repository.VacunaRepository;

@RestController
@RequestMapping("/api/vacunas")
@CrossOrigin(origins = "http://localhost:4200")
public class VacunaController {

    @Autowired
    private VacunaRepository vacunaRepository;

    @GetMapping
    public List<Vacuna> listar() {
        return vacunaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vacuna> buscarPorId(@PathVariable Long id) {
        return vacunaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vacuna crear(@RequestBody Vacuna vacuna) {
        return vacunaRepository.save(vacuna);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vacuna> actualizar(@PathVariable Long id, @RequestBody Vacuna vacuna) {
        return vacunaRepository.findById(id).map(v -> {
            v.setNombre(vacuna.getNombre());
            v.setDescripcion(vacuna.getDescripcion());
            v.setFabricante(vacuna.getFabricante());
            v.setDosis(vacuna.getDosis());
            return ResponseEntity.ok(vacunaRepository.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return vacunaRepository.findById(id).map(v -> {
            vacunaRepository.delete(v);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}