package com.licenta.controller;

import com.licenta.model.*;
import com.licenta.service.UserOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Alexandru on 29/03/16.
 */
@Controller
public class RoomSocketController {

    @Autowired
    private SimpMessagingTemplate template;


    private Map<String, Room> rooms = new ConcurrentHashMap<String, Room>();


    @Autowired
    private UserOnlineService userOnlineService;

    @MessageMapping("/chat/handshake")
    public void processSdp(WebrtcSdpRoom sdp) {
        template.convertAndSend("/message/"+sdp.getDestUsername(), sdp);
    }

    @MessageMapping("/chat/ice")
    public void processIceCandidates(WebrtcIce ice) {
        template.convertAndSend("/message/"+ice.getDestUsername(), ice);
    }



    @MessageMapping("/chat/join")
    public boolean join(JoinRequest request) {
        JoinResponse response = new JoinResponse();
        response.setUsername(request.getUsername());
        response.setType("join");
        Room room = rooms.get(request.getRoom());
        if(room == null) {
            room = new Room();
            rooms.put(request.getRoom(), room);
        }
        if(room.getParticipants().isEmpty() || isOnlyOnlineParticipant(room, request.getUsername())){
            response.setHost(true);
        }
        if (!room.getParticipants().contains(request.getUsername())){
            room.getParticipants().add(request.getUsername());
        }
        rooms.replace(request.getRoom(), room);
        template.convertAndSend("/message/"+request.getRoom(), response);
        return true;
    }



    private boolean isOnlyOnlineParticipant(final Room room, final String username){
        for(String user: room.getParticipants()){
            if(userOnlineService.isUserOnline(user) && !user.equals(username)){
                return false;
            }
        }
        return true ;
    }




}
