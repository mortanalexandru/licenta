package com.licenta.model;

/**
 * Created by Alexandru on 01/03/16.
 */
public class WebrtcSdp {

    private String id;

    private String sdpDescription;

    private String destUsername;

    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSdpDescription() {
        return sdpDescription;
    }

    public void setSdpDescription(String sdpDescription) {
        this.sdpDescription = sdpDescription;
    }

    public String getDestUsername() {
        return destUsername;
    }

    public void setDestUsername(String destUsername) {
        this.destUsername = destUsername;
    }
}
