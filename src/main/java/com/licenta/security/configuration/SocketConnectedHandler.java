package com.licenta.security.configuration;

import com.licenta.model.UserWrapper;
import com.licenta.service.UserOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.security.Principal;

/**
 * Created by Alexandru on 18/01/16.
 */
@Component
public class SocketConnectedHandler implements ApplicationListener<SessionConnectedEvent> {

    @Autowired
    private UserOnlineService userOnlineService;

    @EventListener
    public void onApplicationEvent(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = (String) sha.getHeader("simpSessionId");
        String username = getUsername(sha);
        if (!userOnlineService.isSessionRegistered(username, sessionId)) {
            userOnlineService.addUserConnection(username, sessionId);
        }
    }

    private String getUsername(StompHeaderAccessor sha){
        GenericMessage connectMessage = (GenericMessage) sha.getHeader("simpConnectMessage");
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) connectMessage.getHeaders().get("simpUser");
        UserWrapper userWrapper = (UserWrapper) authenticationToken.getPrincipal();
        return userWrapper.getUsername();
    }
}
