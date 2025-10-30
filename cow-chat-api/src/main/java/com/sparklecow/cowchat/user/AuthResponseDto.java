package com.sparklecow.cowchat.user;

public record AuthResponseDto(
        String jwt,
        String userId
) {
}
