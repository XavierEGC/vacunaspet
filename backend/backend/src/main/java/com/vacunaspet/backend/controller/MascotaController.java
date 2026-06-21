package com.vacunaspet.backend.controller;

import com.vacunaspet.backend.model.Mascota;
import com.vacunaspet.backend.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "http://localhost:4200")
public class MascotaController {

    @Autowired
    private MascotaRepository mascotaRepository;

    @GetMapping
    public List<Mascota> listar() {
        return mascotaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> buscarPorId(@PathVariable Long id) {
        return mascotaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mascota crear(@RequestBody Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mascota> actualizar(@PathVariable Long id, @RequestBody Mascota mascota) {
        return mascotaRepository.findById(id).map(m -> {
            m.setNombre(mascota.getNombre());
            m.setEspecie(mascota.getEspecie());
            m.setRaza(mascota.getRaza());
            m.setFechaNacimiento(mascota.getFechaNacimiento());
            return ResponseEntity.ok(mascotaRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return mascotaRepository.findById(id).map(m -> {
            mascotaRepository.delete(m);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}