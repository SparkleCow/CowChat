package com.sparklecow.cowchat.user;

import com.sparklecow.cowchat.common.PresenceService;
import com.sparklecow.cowchat.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PresenceService presenceService;
    private final JwtUtils jwtUtils;

    public UserResponseDto findUserLogged(Authentication authentication){
        return userMapper.toUserResponseDto((User) authentication.getPrincipal());
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User with username "+username+" not found"));
    }

    public List<UserResponseDto> findAllUsers(){
        return userRepository.findAll().stream().map(userMapper::toUserResponseDto).toList();
    }

    public List<UserResponseDto> findAllUsersExceptSelf(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        List<User> allUsers = userRepository.findAllExcept(user.getId());
        allUsers.forEach(u -> u.setIsOnline(presenceService.isUserOnline(u.getId())));

        return allUsers.stream().map(userMapper::toUserResponseDto).toList();
    }

    public String updateProfileImage(Authentication authentication, String imagePath) {
        if(imagePath == null || imagePath.isEmpty()){
            return "Profile imaged could not be updated";
        }
        User user = (User) authentication.getPrincipal();
        user.setImagePath(imagePath);
        userRepository.save(user);
        return "Profile imaged updated successfully";
    }

    public AuthResponseDto updateUsername(Authentication authentication, UserUpdateDto userUpdateDto) {
        User user = (User) authentication.getPrincipal();
        String newUsername = userUpdateDto.username();

        if (StringUtils.hasText(newUsername) && !newUsername.equals(user.getUsername())) {
            user.setUsername(newUsername);
            userRepository.save(user);
        }

        String token  = jwtUtils.generateToken(user);
        return new AuthResponseDto(token, user.getId());
    }
}
