package com.licenta.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Alexandru on 01/03/16.
 */
@Service
public class UserOnlineService {

    private Map<Integer, List<String>> userConnections = new ConcurrentHashMap<Integer, List<String>>();

    public void addUserConnection(final Integer userId, final String sessionId) {
        List<String> activeSessions;
        if (!userConnections.containsKey(userId)) {
            activeSessions = new ArrayList<String>();
            activeSessions.add(sessionId);
            userConnections.put(userId, activeSessions);
        } else {
            activeSessions = userConnections.get(userId);
            if (!activeSessions.contains(sessionId)) {
                activeSessions.add(sessionId);
                userConnections.replace(userId, activeSessions);
            }
        }
    }

    public void removeUserConnection(final Integer userId, final String sessionId) {
        if (userConnections.containsKey(userId)) {
            List<String> activeSessions = userConnections.get(userId);
            if (activeSessions.contains(sessionId)) {
                activeSessions.remove(sessionId);
            }
            if (!activeSessions.isEmpty()) {
                userConnections.replace(userId, activeSessions);
            }else{
                userConnections.remove(userId);
            }
        }
    }


}
