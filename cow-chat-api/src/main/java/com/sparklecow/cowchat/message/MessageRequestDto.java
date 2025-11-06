package com.sparklecow.cowchat.message;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record MessageRequestDto(

        @NotBlank(message = "Chat ID is required")
        String chatId,

        @NotBlank(message = "Sender ID is required")
        String senderId,

        @NotBlank(message = "Message content cannot be blank")
        String content,

        MessageType messageType,
        String filePath,
        List<String> recipientIds
) {}