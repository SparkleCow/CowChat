package com.sparklecow.cowchat.chat;

import com.sparklecow.cowchat.user.User;
import com.sparklecow.cowchat.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;

    public ChatResponseDto existOrCreateChat(String senderId, String recipientId){
        Optional<Chat> existingChat = chatRepository.findChatBetweenUsers(senderId, recipientId);

        if (existingChat.isPresent()) {
            return chatMapper.toDto(existingChat.get());
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException(""));
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException(""));

        List<User> users = List.of(sender, recipient);

        return chatMapper.toDto(chatRepository.save(Chat.builder().name("Chat").participants(users).build()));
    }

    public ChatResponseDto existOrcreatePrivateChat(String senderId, String recipientId){
        Optional<Chat> existingChat = chatRepository.findPrivateChatBetweenUsers(senderId, recipientId);

        if (existingChat.isPresent()) {
            return chatMapper.toDto(existingChat.get());
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException(""));
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException(""));

        List<User> users = List.of(sender, recipient);

        return chatMapper.toDto(chatRepository.save(Chat.builder().name("Chat").participants(users).build()));
    }
}
