package com.licenta.controller;

import com.licenta.service.UserOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Created by Alexandru on 19/05/16.
 */

@Controller
public class SearchSocketController {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private UserOnlineService userOnlineService;

    @MessageMapping("/searchRooms/getRooms")
    public void getRooms() throws InterruptedException {
        template.convertAndSend("/message/rooms",userOnlineService.getAvailableRooms());
    }


}
