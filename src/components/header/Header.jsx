import React from 'react';

import './style.css';

const Header = () => {
    return (
        <header className="header">
      	    <div className="header__wrapper">
      	        
				<h1 className="header__title">
      	            <strong>Hi, my name is <em>Yuri</em></strong><br />
					<p className='title-1'>(MainPage)</p>
      	            your voice assistant on the site
      	        </h1>

      	        <div className="header__text">
      	            <p>I will help you with passion.</p>
      	        </div>

      	        <a href="#!" className="btn">Download CV</a>

      	    </div>
      	</header>
    );
};

export default Header;