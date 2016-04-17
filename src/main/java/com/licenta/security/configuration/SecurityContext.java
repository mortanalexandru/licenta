package com.licenta.security.configuration;

import java.util.UUID;

import javax.servlet.Filter;
import javax.sql.DataSource;

import com.licenta.access.UserDAO;
import com.licenta.access.impl.UserDAOImpl;
import com.licenta.security.service.UserService;
import com.licenta.constants.UrlMappings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;


/**
 * Spring Security configuration class
 * @author Alexandru
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityContext extends WebSecurityConfigurerAdapter {

    private final String key = UUID.randomUUID().toString();

    /**
     * Constant for third party resources
     */
    private final String THIRD_PARTY_RESOURCES_PATH = "/static/third-party/**";
    
    /**
     * Constatnt for public resources
     */
    private final String PUBLIC_RESOURCES_PATH = "/static/public/**";
    
    @Autowired
    DataSource dataSource;

    /**
     * Configures the data source for the login information
     * @param auth
     * @throws Exception
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /**
     * Configures the access limitations for custom urls
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        /*http.formLogin()
            .loginPage(UrlMappings.LANDING)
            .failureUrl(UrlMappings.LANDING + "?error")
            .loginProcessingUrl("/login")
            .and()
            .authorizeRequests()
            .antMatchers(UrlMappings.LANDING,PUBLIC_RESOURCES_PATH,THIRD_PARTY_RESOURCES_PATH,UrlMappings.SOCIAL_URLS).permitAll()
            .anyRequest().permitAll()
            .and()
            .logout()
            .invalidateHttpSession(true)
            .logoutSuccessUrl(UrlMappings.LANDING)
            .and()
            .csrf();
            */
        http.httpBasic().and()
                .authorizeRequests()
                .antMatchers("/index.html", "/chat","/**").permitAll()
                .and().csrf().csrfTokenRepository(csrfTokenRepository()).and()
                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class);
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }

    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcTokenRepositoryImpl db = new JdbcTokenRepositoryImpl();
        db.setDataSource(dataSource);
        return db;
    }



    /**
     * This bean is load the user specific data when form login is used.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService(userDAO());
    }


    @Bean
    public UserDAO userDAO() {
        return new UserDAOImpl();
    }

    /**
     * This is used to hash the password of the user.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

}