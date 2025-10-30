package com.sparklecow.cowchat.user;

import com.sparklecow.cowchat.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public User createUser(UserRequestDto userRequestDto) {
        return userRepository.save(userMapper.toUser(userRequestDto));
    }

    public AuthResponseDto login(AuthRequestDto authRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequestDto.username(),
                        authRequestDto.password()
                )
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtils.generateToken(user);
        return new AuthResponseDto(token, user.getId());
    }
}
