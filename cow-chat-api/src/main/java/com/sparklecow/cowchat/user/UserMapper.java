package com.sparklecow.cowchat.user;

import com.sparklecow.cowchat.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;

    public User toUser(UserRequestDto userRequestDto) {
        return User
                .builder()
                .email(userRequestDto.email())
                .password(passwordEncoder.encode(userRequestDto.password()))
                .username(userRequestDto.username())
                .build();
    }

    public UserResponseDto toUserResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getImagePath(),
                user.getIsOnline() != null ? user.getIsOnline() : false,
                s3Service.generatePresignedDownloadUrl(
                        user.getImagePath(), Duration.ofMinutes(15)
                )
        );
    }
}
