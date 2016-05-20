package com.licenta.access.impl;

import com.licenta.access.UserDAO;
import com.licenta.model.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


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
}
