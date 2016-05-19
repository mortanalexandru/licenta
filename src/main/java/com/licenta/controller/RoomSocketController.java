package com.licenta.controller;

import com.licenta.model.*;
import com.licenta.service.UserOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
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
        response.setGuest(request.isGuest());
        if(isOnlyOnlineParticipant(request.getRoom(), request.getUsername()) && !request.isGuest()){
            response.setHost(true);
        }
        template.convertAndSend("/message/"+request.getRoom(), response);
        OnlineUserResponse onlineUserResponse = new OnlineUserResponse();
        onlineUserResponse.setType("onlineUsers");
        onlineUserResponse.setOnlineUsers(userOnlineService.getOnlineUsersForRoom(request.getRoom()));
        template.convertAndSend("/message/"+request.getRoom(), onlineUserResponse);
        return true;
    }


    private boolean isOnlyOnlineParticipant(final String room, final String username){
        for(String user: userOnlineService.getOnlineUsersForRoom(room)){
            if(!user.equals(username) && !user.contains("guest")){
                return false;
            }
        }
        return true ;
    }


}
