package com.sparklecow.cowchat.message;

import com.sparklecow.cowchat.chat.Chat;
import com.sparklecow.cowchat.chat.ChatRepository;
import com.sparklecow.cowchat.user.User;
import com.sparklecow.cowchat.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    public MessageResponseDto sendMessage(MessageRequestDto messageRequestDto) {

        Chat chat = chatRepository.findById(messageRequestDto.chatId())
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        User sender = userRepository.findById(messageRequestDto.senderId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(messageRequestDto.content());
        message.setMessageType(messageRequestDto.messageType());
        message.setFilePath(messageRequestDto.filePath());
        message.setTimestamp(LocalDateTime.now());

        List<User> recipients = userRepository.findAllById(messageRequestDto.recipientIds());
        message.setRecipients(recipients);

        Message saved = messageRepository.save(message);
        return messageMapper.toDto(saved);
    }
}