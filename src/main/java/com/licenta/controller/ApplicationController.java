package com.licenta.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * Created by Alexandru on 01/03/16.
 */
@RestController
public class ApplicationController {

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
}
