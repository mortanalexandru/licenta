package com.licenta.adapter;

import com.licenta.dataobjects.UserDTO;
import com.licenta.model.User;

/**
 * Created by Alexandru on 24/03/16.
 */
public final class UserAdapter {

    public static UserDTO adaptUserToUserDTO(final User user){
        final UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getEmail());
        userDTO.setCountry(user.getCountry());
        userDTO.setGender(user.getGender());
        userDTO.setName(user.getDisplayName());
        return userDTO;
    }
}
