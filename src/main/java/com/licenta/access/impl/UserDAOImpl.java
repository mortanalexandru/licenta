package com.licenta.access.impl;

import java.util.List;

import com.licenta.access.UserDAO;

import com.licenta.exceptions.DuplicateEmailException;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;


import com.licenta.model.User;

/**
 * {@inheritDoc}
 * @author Alexandru, Norbert, Delia
 *
 */
public class UserDAOImpl implements UserDAO {

	@Autowired
	private SessionFactory sessionFactory;
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public User getUserByEmail(final String email) {
		final Session session = sessionFactory.openSession();
		session.beginTransaction();

		final Criteria criteria = session.createCriteria(User.class);
		   User result = null;
		   criteria.add(Restrictions.eq("email", email));
		   List<User> resultAsList = (List<User>) (criteria.list());
		   if (!resultAsList.isEmpty()) {
			   result = resultAsList.get(0);
		   }
		session.getTransaction().commit();
		session.close();
		return result;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public User getUserById(final int userId) {
		final Session session = sessionFactory.openSession();
		session.beginTransaction();

		final Criteria criteria = session.createCriteria(User.class);
		User result = null;
		criteria.add(Restrictions.eq("id", userId));
		List<User> resultAsList = (List<User>) (criteria.list());
		if (!resultAsList.isEmpty()) {
			result = resultAsList.get(0);
		}
		session.getTransaction().commit();
		session.close();
		return result;
	}
	
	@Override
	public List<User> getUsers() {
		final Session session = sessionFactory.openSession();
		session.beginTransaction();

		final Criteria criteria = sessionFactory.getCurrentSession().createCriteria(User.class);
	    final List<User> result = (List<User>) (criteria.list());

		session.getTransaction().commit();
		session.close();
		return result;
	}



	/**
	 * {@inheritDoc}
	 */
	@Override
	public User registerNewUserAccount(final User user) throws DuplicateEmailException {
		if (emailExist(user.getEmail())) {
			throw new DuplicateEmailException("The email address: " + user.getEmail() + " is already in use.");
		}

		Session session = sessionFactory.openSession();
		session.beginTransaction();
		session.save(user);
		session.getTransaction().commit();
		session.close();
		return user;
	}


	/**
	 * @param email
	 * @return true if the email already exists in the database,
	 * 			false otherwise.
	 */
	public boolean emailExist(final String email) {
        User user = getUserByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }
}
