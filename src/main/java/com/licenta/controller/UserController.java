package com.licenta.controller;

import com.licenta.dataobjects.UserDTO;
import com.licenta.service.UserOnlineService;
import com.licenta.service.UserService;
import org.hibernate.annotations.AccessType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Alexandru on 24/03/16.
 */
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("/getUsers")
    public List<UserDTO> getOnlineUsers(){
        return userService.getOnlineUsers();
    };


}
