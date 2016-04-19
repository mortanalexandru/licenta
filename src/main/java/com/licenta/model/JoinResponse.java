package com.licenta.model;

/**
 * Created by Alexandru on 30/03/16.
 */
public class JoinResponse {

    private String type;

    private String username;

    private boolean host;

    private boolean guest;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isHost() {
        return host;
    }

    public void setHost(boolean host) {
        this.host = host;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isGuest() {
        return guest;
    }

    public void setGuest(boolean guest) {
        this.guest = guest;
    }
}
