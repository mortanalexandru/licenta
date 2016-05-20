package com.licenta.security.configuration;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;
/**
 * Hibernate configuration class
 * @author Alexandru
 *
 */
@Configuration
@EnableTransactionManagement
@PropertySource(value = { "classpath:jdbc.properties" })
public class HibernateContext {
 
	private final String JDBC_URL_KEY = "jdbc.databaseurl";
	private final String JDBC_DRIVER_KEY = "jdbc.driverClassName";
	private final String JDBC_USERNAME_KEY = "jdbc.username";
	private final String JDBC_PASSWORD_KEY = "jdbc.password";
	private final String JDBC_DIALECT = "jdbc.dialect";
	
    @Autowired
    private Environment environment;
 
    /**
     * Bean for local session factory
     * @return
     */
    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setPackagesToScan(new String[] { "com.licenta.model"});
        sessionFactory.setHibernateProperties(hibernateProperties());
        return sessionFactory;
     }
     
    /**
     * Data source bean
     * @return
     */
    @Bean(name = "dataSource")
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getRequiredProperty(JDBC_DRIVER_KEY));
        dataSource.setUrl(environment.getRequiredProperty(JDBC_URL_KEY));
        dataSource.setUsername(environment.getRequiredProperty(JDBC_USERNAME_KEY));
        dataSource.setPassword(environment.getRequiredProperty(JDBC_PASSWORD_KEY));
        return dataSource;
    }
    
    /**
     * Returns custom hibernate properties
     * @return
     */
    private Properties hibernateProperties() {
        Properties properties = new Properties();
        properties.put("hibernate.dialect", environment.getRequiredProperty(JDBC_DIALECT));
        return properties;        
    }
     
    /**
     * Bean for transaction manager
     * @param session
     * @return
     */
    @Bean
    @Autowired
    public HibernateTransactionManager transactionManager(SessionFactory session) {
       HibernateTransactionManager txManager = new HibernateTransactionManager();
       txManager.setSessionFactory(session);
       return txManager;
    }
}