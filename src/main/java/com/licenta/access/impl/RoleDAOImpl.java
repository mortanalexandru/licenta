package com.licenta.access.impl;

import com.licenta.access.RoleDAO;
import com.licenta.constants.RoleType;
import com.licenta.model.Role;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * {@inheritDoc}
 * Created by Norbert Felegyhazi on 3/12/2015.
 */
public class RoleDAOImpl implements RoleDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Role getRoleByRoleName(final RoleType roleName) {
        Session session = sessionFactory.openSession();
        session.beginTransaction();

        final Criteria criteria = session.createCriteria(Role.class);
        Role result = null;
        criteria.add(Restrictions.eq("role", roleName.toString()));
        List<Role> resultAsList = (List<Role>) (criteria.list());
        if (!resultAsList.isEmpty()) {
            result = resultAsList.get(0);
        }
        session.getTransaction().commit();
        session.close();
        return result;

    }
}
