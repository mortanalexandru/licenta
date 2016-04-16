package com.licenta.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Alexandru on 01/03/16.
 */
@Service
public class UserOnlineService {

    private Map<String, List<String>> userConnections = new ConcurrentHashMap<String, List<String>>();

    private Map<String, List<String>> userRoomConnections = new ConcurrentHashMap<String, List<String>>();


    public void addUserConnection(final String username, final String sessionId) {
        List<String> activeSessions;
        if (!userConnections.containsKey(username)) {
            activeSessions = new ArrayList<String>();
            activeSessions.add(sessionId);
            userConnections.put(username, activeSessions);
        } else {
            activeSessions = userConnections.get(username);
            if (!activeSessions.contains(sessionId)) {
                activeSessions.add(sessionId);
                userConnections.replace(username, activeSessions);
            }
        }
    }

    public void addRoomParticipant(final String room, final String username) {
        List<String> users;
        if (!userRoomConnections.containsKey(room)) {
            users = new ArrayList<String>();
            users.add(username);
            userRoomConnections.put(room, users);
        } else {
            users = userRoomConnections.get(username);
            if (!users.contains(username)) {
                users.add(username);
                userRoomConnections.replace(username, users);
            }
        }
    }

    public void removeRoomParticipant(final String username, final String sessionId) {
        if (userRoomConnections.containsKey(username)) {
            List<String> users = userRoomConnections.get(username);
            if (users.contains(sessionId)) {
                users.remove(sessionId);
            }
            if (!users.isEmpty()) {
                userRoomConnections.replace(username, users);
            }else{
                userRoomConnections.remove(username);
            }
        }
    }

    public List<String> getRoomUsers(final String roomName){
        List<String> users;
        if (!userRoomConnections.containsKey(roomName)) {
            return new ArrayList<String>();
        }else{
            return userRoomConnections.get(roomName);
        }
    }





    public boolean isUserOnline(final String username){
        return userConnections.containsKey(username);
    }

    public boolean isSessionRegistered(final String username, final String sessionId){
        if(userConnections.containsKey(username)){
            List<String> activeSessions = userConnections.get(username);
            if (activeSessions.contains(sessionId)) {
                return true;
            }
        }
        return false;
    }

    public void removeUserConnection(final String username, final String sessionId) {
        if (userConnections.containsKey(username)) {
            List<String> activeSessions = userConnections.get(username);
            if (activeSessions.contains(sessionId)) {
                activeSessions.remove(sessionId);
            }
            if (!activeSessions.isEmpty()) {
                userConnections.replace(username, activeSessions);
            }else{
                userConnections.remove(username);
            }
        }
    }

    public Set<String> getOnlineUsernames(){
        return userConnections.keySet();
    }


}
