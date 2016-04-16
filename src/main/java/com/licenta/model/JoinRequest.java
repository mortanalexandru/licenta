package com.licenta.model;

/**
 * Created by Alexandru on 29/03/16.
 */
public class JoinRequest {

    private String type;

    private String username;

    private String room;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
