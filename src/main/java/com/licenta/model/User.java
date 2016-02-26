package com.licenta.model;



import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * User entity
 * @author Alexandru
 *
 */
@Entity
@Table(name = "User")
public class User implements Serializable {
	
    /**
	 *  Default serial version
	 */
	private static final long serialVersionUID = 1L;

	private int id;

    private String email;
    
    private String password;
    
    private String displayName;
    
    private Date birthdate;
    
    private String gender;
    
    private String country;
    
    private String signInProvider;
    
    /**
  	* All the roles the user has
  	*/
    private Set<Role> roles;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name = "idUser", 
		unique = true, nullable = false)
    public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "email", unique = true, 
			nullable = true, length = 45)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "password", unique = false, 
			nullable = true, length = 45)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "display_name", unique = false, 
			nullable = true, length = 45)
	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	@Column(name = "birthdate", nullable = false)
	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

	@Column(name = "gender", unique = false, 
			nullable = true, length = 45)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name = "country", unique = false, 
			nullable = true, length = 45)
	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

    @OneToMany(cascade=CascadeType.ALL, fetch= FetchType.EAGER)
    @JoinTable(name="User_Role",
        joinColumns = {@JoinColumn(name="idUser", referencedColumnName="idUser")},
        inverseJoinColumns = {@JoinColumn(name="idRole", referencedColumnName="idRole")}
    )
	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}


	public void addRole(Role role) {
		if (this.roles == null){
			this.roles = new HashSet<Role>();
		}
		roles.add(role);
	}
}
