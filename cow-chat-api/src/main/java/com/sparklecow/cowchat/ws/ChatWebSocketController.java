package com.sparklecow.cowchat.ws;

import com.sparklecow.cowchat.message.MessageRequestDto;
import com.sparklecow.cowchat.message.MessageResponseDto;
import com.sparklecow.cowchat.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, Boolean> onlineUsers = new ConcurrentHashMap<>();


    @MessageMapping("/chat/{chatId}/send")
    public void sendMessage(@DestinationVariable String chatId, MessageRequestDto dto) {
        MessageResponseDto saved = messageService.sendMessage(dto);

        messagingTemplate.convertAndSend("/topic/chat/" + chatId, saved);
    }

    @MessageMapping("/presence")
    public void updatePresence(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        boolean online = (Boolean) payload.get("online");

        onlineUsers.put(userId, online);

        messagingTemplate.convertAndSend("/topic/presence", Map.of(
                "userId", userId,
                "online", online
        ));
    }

    public boolean isUserOnline(String userId) {
        return onlineUsers.getOrDefault(userId, false);
    }
}
