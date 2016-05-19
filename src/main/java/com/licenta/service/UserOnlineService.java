package com.licenta.service;

import com.licenta.model.JoinResponse;
import com.licenta.model.Room;
import com.licenta.model.SessionUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Alexandru on 01/03/16.
 */
@Service
public class UserOnlineService {

    private Map<String, List<String>> userConnections = new ConcurrentHashMap<String, List<String>>();

    private Map<String, List<SessionUser>> userRoomConnections = new ConcurrentHashMap<String, List<SessionUser>>();

    @Autowired
    private SimpMessagingTemplate template;

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

    public void addRoomParticipant(final String room, final String username, final String sessionId) {
        List<SessionUser> users;
        if (!userRoomConnections.containsKey(room)) {
            users = new ArrayList<SessionUser>();
            users.add(new SessionUser(username, sessionId));
            System.out.println("Username "+ username + "added in room "+room+"session id"+sessionId);
            userRoomConnections.put(room, users);
        } else {
            boolean found = false;
            boolean changed = false;
            users = userRoomConnections.get(room);
            for(final SessionUser user: users){
                if (user.getUsername().equals(username)) {
                    found = true;
                    if(!user.getSessionId().equals(sessionId)) {
                        user.setSessionId(sessionId);
                        changed = true;
                    }
                }
            }
            if(!found){
                users.add(new SessionUser(username, sessionId));
                changed = true;
            }
            if(changed) {
                System.out.println("Username "+ username + "added in room "+room+"session id"+sessionId);
                JoinResponse response = new JoinResponse();
                response.setType("userJoined");
                response.setUsername(username);
                template.convertAndSend("/message/"+room, response);
                userRoomConnections.replace(username, users);
            }
        }
        template.convertAndSend("/message/rooms",getAvailableRooms());
    }

    public List<String> getOnlineUsersForRoom(final String room){
        final List<String> usernames = new ArrayList<String>();
        List<SessionUser> users = userRoomConnections.get(room);
        for(final SessionUser user: users){
            usernames.add(user.getUsername());
        }
        return usernames;
    }


    public void removeRoomParticipant(final String sessionId) {
        Set<String> keyset = userRoomConnections.keySet();
        String username = "";
        for(final String room: keyset){
            boolean replace = false;
            List<SessionUser> users = new ArrayList<SessionUser>();
            users.addAll(userRoomConnections.get(room));
            Iterator<SessionUser> iter = users.iterator();
            while (iter.hasNext()) {
                SessionUser user = iter.next();
                if(user.getSessionId().equals(sessionId)){
                    username = user.getUsername();
                    iter.remove();
                    replace = true;
                }
            }
            if(replace) {
                System.out.println("User removed from  "+room+"session id"+sessionId);
                if (users.size() > 0) {
                    JoinResponse response = new JoinResponse();
                    response.setType("userLeft");
                    response.setUsername(username);
                    template.convertAndSend("/message/"+room, response);
                    userRoomConnections.replace(room, users);
                }else {
                    userRoomConnections.remove(room);
                }
                template.convertAndSend("/message/rooms", getAvailableRooms());
            }
        }
    }


    public List<Room> getAvailableRooms(){
        List<Room> availableRooms = new ArrayList<Room>();
        Set<String> keyset = userRoomConnections.keySet();
        String username = "";
        for(final String roomName: keyset){
            List<String> users = new ArrayList<String>();
            for(final SessionUser user: userRoomConnections.get(roomName)){
                users.add(user.getUsername());
            }
            Room room = new Room();
            room.setRoomName(roomName);
            room.setParticipants(users);
            availableRooms.add(room);
        }
        return availableRooms;
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
