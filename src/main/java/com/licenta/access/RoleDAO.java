package com.licenta.access;

import com.licenta.constants.RoleType;
import com.licenta.model.Role;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleDAO {

    /**
     * @param roleName
     * @return The Role object that is associated with the specified roleName,
     * or null in case there is no such role.
     */
    public Role getRoleByRoleName(RoleType roleName);
}
