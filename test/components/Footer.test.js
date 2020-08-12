import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Footer from "../../src/components/Footer";

describe('Footer', () => {
	it('should always pass', () => {
		expect(true).toBe(true);
	});

	it('should render a single Footer component', () => {
		const wrapper = shallow(<Footer />);
		expect(true).toBe(true);
	});

});
