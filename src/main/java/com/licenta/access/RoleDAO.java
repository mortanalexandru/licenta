package com.licenta.access;

import com.licenta.model.Role;
import com.licenta.constants.RoleType;
import org.springframework.stereotype.Repository;

/**
 * Role DAO implementation. This class should be responsible for the interaction with the Role table in the database.
 * Every method should be responsible for opening the session and for closing it.
 * Created by Norbert Felegyhazi on 3/12/2015.
 */
@Repository
public interface RoleDAO {

    /**
     * @param roleName
     * @return The Role object that is associated with the specified roleName,
     * or null in case there is no such role.
     */
    public Role getRoleByRoleName(RoleType roleName);
}
