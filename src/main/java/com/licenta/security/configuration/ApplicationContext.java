package com.licenta.security.configuration;


import com.licenta.access.RoleDAO;
import com.licenta.access.impl.RoleDAOImpl;
import com.licenta.constants.UrlMappings;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * Spring Mvc configuration class. This imports also security and hibernate configurations
 *
 * @author Alexandru
 */
@EnableWebMvc
@Configuration
@ComponentScan(basePackages = {"com.licenta.*"})
@Import({SecurityContext.class, HibernateContext.class})
public class ApplicationContext extends WebMvcConfigurerAdapter {

    private final String STATIC_RESOURCE_PATH = "/";
    private final String HTML_RESOURCE_PATH = "/";
    private final String HTML_EXTENSION = ".html";
    private final int messageSourceCacheSeconds = 100;

    /**
     * Adds the resource handlers for css and js
     */
    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler(UrlMappings.STATIC_RESOURCES_URL).addResourceLocations(STATIC_RESOURCE_PATH);
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    /**
     * Return a view resolver for the jsp files
     *
     * @return
     */
    @Bean
    public InternalResourceViewResolver jspViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setViewClass(JstlView.class);
        bean.setPrefix(HTML_RESOURCE_PATH);
        bean.setSuffix(HTML_EXTENSION);
        return bean;
    }

    @Bean
    public RoleDAO roleDAO() {
        return new RoleDAOImpl();
    }

    @Bean
    public SocketConnectedHandler socketConnectedHandler() {
        return new SocketConnectedHandler();
    }

    @Bean
    public SocketDisconnectedHandler socketDisonnectedHandler() {
        return new SocketDisconnectedHandler();
    }

}
