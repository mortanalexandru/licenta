//package com.licenta.controller;
//
//import com.licenta.model.WebrtcSdp;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.annotation.SubscribeMapping;
//import org.springframework.stereotype.Controller;
//
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
///**
// * Created by Alexandru on 18/01/16.
// */
//@Controller
//public class SocketController {
//
//    private Map<Integer, String> userConnections = new ConcurrentHashMap<Integer, String>();
//
//    @MessageMapping("/chat")
//    @SendTo("/topic/message")
//    public String getMessage(WebrtcSdp sdp){
//        userConnections.put(sdp.getId(),sdp.getSdpDescription());
//        return "";
//    }
//
//    @SubscribeMapping("/topic/message")
//    public String list() {
//        return "anything";
//    }
//
//}
