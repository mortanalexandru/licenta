package com.licenta.model;

/**
 * Created by Alexandru on 30/03/16.
 */
public class JoinResponse {

    private String type;

    private String username;

    private boolean isHost;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isHost() {
        return isHost;
    }

    public void setHost(boolean host) {
        isHost = host;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
