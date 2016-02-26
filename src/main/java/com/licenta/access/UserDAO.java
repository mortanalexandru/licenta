package com.licenta.access;

import com.licenta.exceptions.DuplicateEmailException;
import org.springframework.stereotype.Repository;
import java.util.List;


import com.licenta.model.User;

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

	/**
	 * @param userId
	 * @return The User with the specified userId.
	 */
	public User getUserById(final int userId);

	/**
	 * Persists the user.
	 * @return The User that was successfully saved in the database.
	 */
	public User registerNewUserAccount(final User user) throws DuplicateEmailException;
	
	public List<User> getUsers();

}
