package com.licenta.controller;

import com.licenta.service.UserOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * Created by Alexandru on 01/03/16.
 */
@RestController
public class ApplicationController {

    @Autowired
    private UserOnlineService onlineService;

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping("/getRoomUsers")
    public List<String> user(final String roomName) {
        return onlineService.getRoomUsers(roomName);
    }

}
