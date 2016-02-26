package com.licenta.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.social.security.SocialUser;

/**
 * Entity to be stored on session
 * @author Alexandru 
 *
 */
public class UserWrapper extends SocialUser {
	
	/**
	 * Default serial version
	 */
	private static final long serialVersionUID = 1L;
	
	private User user;

	public UserWrapper(User user, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked) {
		super(user.getEmail(), user.getPassword(), enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, buildUserAuthority(user.getRoles()));
		this.user = user;
	}
	public UserWrapper(User user) {
		super(user.getEmail(), user.getPassword(), buildUserAuthority(user.getRoles()));
		this.user = user;
	}

	/**
	 * @return the user
	 */
	public User getUser(){
		return this.user;
	}

	/**
	 * @param user
	 */
	public void setUser(final User user){
		this.user = user;
	}

	@Override
	public String getUserId() {
		return user.getEmail();
	}


	/**
	 * Return a list with user authorities base on his role
	 * @param roles
	 * @return
	 */
	private static List<GrantedAuthority> buildUserAuthority(Set<Role> roles) {
		Set<GrantedAuthority> setAuths = new HashSet<GrantedAuthority>();
		for (Role role : roles) {
			setAuths.add(new SimpleGrantedAuthority(role.getRole()));
		}

		List<GrantedAuthority> Result = new ArrayList<GrantedAuthority>(setAuths);
		return Result;
	}
}
