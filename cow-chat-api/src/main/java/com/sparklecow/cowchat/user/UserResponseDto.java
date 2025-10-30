package com.sparklecow.cowchat.user;

public record UserResponseDto(
        String id,
        String username,
        String email,
        String imagePath,
        boolean isOnline,
        String presignedUrl
) {
}