package com.licenta.security.configuration;

import javafx.application.Application;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Created by Alexandru on 18/01/16.
 */
public class SocketDisconnectedHandler implements ApplicationListener<SessionDisconnectEvent> {

    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken)sha.getMessageHeaders().get("simpUser");
    }
}
