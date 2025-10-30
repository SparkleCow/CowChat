package com.sparklecow.cowchat.common;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<String, Boolean> onlineUsers = new ConcurrentHashMap<>();

    public void setUserOnline(String userId) {
        onlineUsers.put(userId, true);
    }

    public void setUserOffline(String userId) {
        onlineUsers.put(userId, false);
    }

    public boolean isUserOnline(String userId) {
        return onlineUsers.getOrDefault(userId, false);
    }

    public Map<String, Boolean> getAllStatuses() {
        return onlineUsers;
    }
}
