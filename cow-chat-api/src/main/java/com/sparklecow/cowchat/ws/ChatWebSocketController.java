package com.sparklecow.cowchat.ws;

import com.sparklecow.cowchat.common.PresenceService;
import com.sparklecow.cowchat.message.MessageRequestDto;
import com.sparklecow.cowchat.message.MessageResponseDto;
import com.sparklecow.cowchat.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PresenceService presenceService;

    /**
     * Handle sending messages through WebSocket.
     */
    @MessageMapping("/chat/{chatId}/send")
    public void sendMessage(@DestinationVariable String chatId, MessageRequestDto dto) {
        MessageResponseDto saved = messageService.sendMessage(dto);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, saved);
    }

    /**
     * Handle user presence updates (online/offline).
     * Example payload:
     * {
     *   "userId": "123",
     *   "online": true
     * }
     */
    @MessageMapping("/presence")
    public void updatePresence(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        boolean online = (Boolean) payload.get("online");

        if (online) {
            presenceService.setUserOnline(userId);
        } else {
            presenceService.setUserOffline(userId);
        }

        // Notify all subscribers of the presence change
        messagingTemplate.convertAndSend("/topic/presence", Map.of(
                "userId", userId,
                "online", online
        ));
    }
}
