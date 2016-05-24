package com.licenta.controller;

import com.licenta.constants.UrlMappings;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
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
        return "target/index";
    }

	/**
	 * Get method for the base page
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/page2", method = RequestMethod.GET)
	public String getLandingPage2(final Model model) {
		return "target/index2";
	}

}
