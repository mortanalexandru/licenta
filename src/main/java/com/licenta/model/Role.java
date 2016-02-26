package com.licenta.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Role entity
 * @author Alexandru
 *
 */
@Entity
@Table(name = "Role")
public class Role implements Serializable {

	/**
	 * Default serial version
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "idRole", unique = true, nullable = false)
	private int id;
	
	@Column(name="role_name")
	private String role;
	
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	
}
