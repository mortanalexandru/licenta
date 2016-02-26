package com.licenta.security.configuration;

import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 * Application Initializer. This is the equivalent of web.xml
 * @author Alexandru
 *
 */
@Order(1)
public class ApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	private String DEFAULT_SERVLET_MAPPING = "/";
	
	/**
	 * Returns the configuration classes
	 */
	@Override
	protected Class<?>[] getRootConfigClasses() {
		return new Class[] { ApplicationContext.class, WebSocketConfig.class};
	}

	/**
	 * Custom servlet Configuration classed
	 */
	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class[] { ApplicationContext.class};
	}

	/**
	 * The Servlet mappings
	 */
	@Override
	protected String[] getServletMappings() {
		return new String[] { DEFAULT_SERVLET_MAPPING };
	}
	
}
