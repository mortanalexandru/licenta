package com.licenta.security.configuration;

import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

/**
 * Created by Alexandru on 18/01/16.
 */
public class SocketConnectedHandler implements ApplicationListener<SessionConnectedEvent> {

    public void onApplicationEvent(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken)sha.getMessageHeaders().get("simpConnectMessage");
    }
}
