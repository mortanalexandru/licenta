package com.licenta.service;

import com.licenta.access.UserDAO;
import com.licenta.adapter.UserAdapter;
import com.licenta.dataobjects.UserDTO;
import com.licenta.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Alexandru on 24/03/16.
 */
@Service
public class UserService {

    @Autowired
    private UserOnlineService userOnlineService;

    @Autowired
    private UserDAO userDAO;

    public List<UserDTO> getOnlineUsers(){
        List<UserDTO> userDTOs = new ArrayList<UserDTO>();
        for(String username: userOnlineService.getOnlineUsernames()){
            User user = userDAO.getUserByEmail(username);
            userDTOs.add(UserAdapter.adaptUserToUserDTO(user));
        }
        return userDTOs;
    }

}
