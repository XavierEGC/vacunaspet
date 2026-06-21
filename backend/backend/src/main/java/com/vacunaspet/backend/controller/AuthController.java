package com.vacunaspet.backend.controller;

import com.vacunaspet.backend.dto.LoginRequest;
import com.vacunaspet.backend.dto.LoginResponse;
import com.vacunaspet.backend.model.Usuario;
import com.vacunaspet.backend.repository.UsuarioRepository;
import com.vacunaspet.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Usuario o contraseña incorrectos");
            return ResponseEntity.status(401).body(error);
        }

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol().name());

        LoginResponse response = new LoginResponse(
                token,
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getRol().name()
        );

        return ResponseEntity.ok(response);
    }
}