package com.licenta.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

/**
 * Created by Alexandru on 18/01/16.
 */
@Controller
public class SocketController {

    @MessageMapping("/chat")
    @SendTo("/topic/message")
    public String getMessage(String name){
        return name;
    }

    @SubscribeMapping("/topic/message")
    public String list() {
        return "anything";
    }

}
