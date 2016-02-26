package com.licenta.constants;

/**
 * Constant class for common used URL mappings
 * @author Alexandru
 *
 */
public class UrlMappings {

	/** The url that point to a resource ( js, css, images ) should start with /static/ */
	public final static String STATIC_RESOURCES_URL = "/static/**";

	/**Logout url*/
	public static final String LOGOUT_URL = "/logout";

	/**This url is used by the social sign up*/
	public static final String SOCIAL_URLS = "/auth";

	/**Search page url*/
	public static final String SEARCH_PAGE = "/";
	/**Profile page url*/
	public static final String PROFILE_PAGE = "/profile";

	/***[ONLY FOR PRIVATE_BETA] * [REMOVE AFTER PRIVATE_BETA]*/
	public static final String REQUEST_INVITATION = "/requestInvitation";
	/***[ONLY FOR PRIVATE_BETA] * [REMOVE AFTER PRIVATE_BETA]*/
	public static final String REQUEST_INVITATION_RELATIVE = "requestInvitation";

	
	/**Base page*/
	public final static String BASE = "/";
	
	/**Landing page url*/
	public final static String LANDING = "/landing";
	
	
	
	
}
