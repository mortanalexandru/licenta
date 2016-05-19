package com.licenta.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Alexandru on 29/03/16.
 */
public class Room {

    private String roomName;


    private List<String> participants;

    public Room() {
        participants = new ArrayList<String>();
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public boolean containsParticipant(final String username){
        return participants.contains(username);
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }
}
