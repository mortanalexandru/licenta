package com.licenta.model;

/**
 * Created by Alexandru on 19/04/16.
 */
public class SessionUser {

    private String username;
    private String sessionId;


    public SessionUser(String username, String sessionId) {
        this.username = username;
        this.sessionId = sessionId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
