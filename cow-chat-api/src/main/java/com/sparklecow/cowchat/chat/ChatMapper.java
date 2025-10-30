package com.sparklecow.cowchat.chat;

import com.sparklecow.cowchat.message.Message;
import com.sparklecow.cowchat.message.MessageMapper;
import com.sparklecow.cowchat.message.MessageResponseDto;
import com.sparklecow.cowchat.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMapper {

    private final MessageMapper messageMapper;

    public ChatResponseDto toDto(Chat chat) {
        if (chat == null) {
            return null;
        }

        List<String> participantIds = chat.getParticipants() != null
                ? chat.getParticipants().stream()
                .map(User::getId)
                .toList()
                : List.of();


        List<MessageResponseDto> messageDtos = chat.getMessages() != null
                ? chat.getMessages().stream()
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(messageMapper::toDto)
                .toList()
                : List.of();

        return new ChatResponseDto(
                chat.getId(),
                chat.getName(),
                participantIds,
                messageDtos
        );
    }
}
