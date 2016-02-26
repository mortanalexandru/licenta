package com.licenta.exceptions;

public class DuplicateEmailException extends Exception {

	  private static final long serialVersionUID = 1629581857679656083L;

	  /**
	   * Instantiates a new RobecoServiceException protocol exception.
	   * 
	   * @param message
	   *          the message
	   */
	  public DuplicateEmailException(final String message) {
	    super(message);
	  }

	  /**
	   * Instantiates a new RobecoServiceException protocol exception.
	   * 
	   * @param message
	   *          the message
	   * @param cause
	   *          the cause
	   */
	  public DuplicateEmailException(final String message, final Throwable cause) {
	    super(message, cause);
	  }

}
