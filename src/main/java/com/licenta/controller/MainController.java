package com.licenta.controller;

import com.licenta.constants.PageName;
import com.licenta.constants.UrlMappings;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

/**
 * Created by Norbert Felegyhazi on 2/22/2015.
 */
@Controller
public class MainController {
	
	/**
	 * Get method for the base page
	 * @param model
	 * @return
	 */
    @RequestMapping(value = UrlMappings.BASE, method = RequestMethod.GET)
    public String getLandingPage(final Model model) {
        return "/home";
    }

    /**
     * Get method for landing page
     * @return
     */
    @RequestMapping(value = UrlMappings.LANDING, method = RequestMethod.GET)
    public String getLoginPage(final Model model) {
        return "/home";
    }
    
}
