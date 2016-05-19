package com.licenta.model;

import java.util.List;

/**
 * Created by Alexandru on 19/05/16.
 */
public class OnlineUserResponse {

    private String type;
    private List<String> onlineUsers;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getOnlineUsers() {
        return onlineUsers;
    }

    public void setOnlineUsers(List<String> onlineUsers) {
        this.onlineUsers = onlineUsers;
    }
}
