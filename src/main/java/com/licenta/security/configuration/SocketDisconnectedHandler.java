package com.licenta.security.configuration;

import com.licenta.model.UserWrapper;
import com.licenta.service.UserOnlineService;
import javafx.application.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

/**
 * Created by Alexandru on 18/01/16.
 */
@Component
public class SocketDisconnectedHandler implements ApplicationListener<SessionDisconnectEvent> {

    @Autowired
    private UserOnlineService userOnlineService;

    @EventListener
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = (String) sha.getHeader("simpSessionId");
        String username = getUsername(sha);
        if (username != null && userOnlineService.isSessionRegistered(username, sessionId)) {
            userOnlineService.removeUserConnection(username, sessionId);
        }
    }


    private String getUsername(StompHeaderAccessor sha){
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) sha.getHeader("simpUser");
        if(authenticationToken != null) {
            UserWrapper userWrapper = (UserWrapper) authenticationToken.getPrincipal();
            return userWrapper.getUsername();
        }
        return null;
    }
}
