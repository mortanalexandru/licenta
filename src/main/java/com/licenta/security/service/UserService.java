package com.licenta.security.service;

import com.licenta.access.UserDAO;
import com.licenta.model.User;
import com.licenta.model.UserWrapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
/**
 * User Service for Spring Security
 * @author Alexandru
 *
 */
@Service("userSecurityService")
public class UserService implements UserDetailsService {

	@Autowired
	private UserDAO userDAO;

	public UserService(){}

	/**
	 * @param userDAO
	 */
	public UserService(final UserDAO userDAO){
		this.userDAO = userDAO;
	}
	
	/**
	 * Gets User by username
	 */
	@Transactional(readOnly=true)
	@Override
	public UserDetails loadUserByUsername(final String username){
		User user = userDAO.getUserByEmail(username);
		if (user == null) {
			throw new UsernameNotFoundException("No user found with username: " + username);
		}
		return buildUserForAuthentication(user);
	}

	/**
	 * Adapts the User entity to UserWrapper entity which is stored on session
	 * @param user
	 * @return
	 */
	private UserDetails buildUserForAuthentication(final User user) {
		return new UserWrapper(user, true , true, true, true);
	}
	
}
