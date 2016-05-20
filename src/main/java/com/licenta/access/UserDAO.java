package com.licenta.access;

import com.licenta.model.User;
import org.springframework.stereotype.Repository;

/**
 * User DAO implementation. This class should be responsible for the interaction with the User table in the database.
 * Every method should be responsible for opening the session and for closing it.
 * @author Alexandru
 *
 */
@Repository
public interface UserDAO {
	
	/**
	 * @param email
	 * @return The User with the specified email address.
	 */
	public User getUserByEmail(final String email);


}
