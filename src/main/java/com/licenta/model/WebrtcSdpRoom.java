package com.licenta.model;

import java.io.Serializable;

/**
 * Created by Alexandru on 01/03/16.
 */
public class WebrtcSdpRoom  implements Serializable {

    private String username;

    private String sdpDescription;

    private String type;

    private String room;

    private String destUsername;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDestUsername() {
        return destUsername;
    }

    public void setDestUsername(String destUsername) {
        this.destUsername = destUsername;
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

    public String getSdpDescription() {
        return sdpDescription;
    }

    public void setSdpDescription(String sdpDescription) {
        this.sdpDescription = sdpDescription;
    }

}
