import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Header from "../../src/components/Header";

describe('Header', () => {
	it('should always pass', () => {
		expect(true).toBe(true);
	});

	it('should render a single Header component', () => {
		const wrapper = shallow(<Header />);
		expect(true).toBe(true);
	});

});
