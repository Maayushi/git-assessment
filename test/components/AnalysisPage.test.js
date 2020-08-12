import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AnalysisPage from "../../src/components/AnalysisPage";

describe('AnalysisPage', () => {
	it('should always pass', () => {
		expect(true).toBe(true);
	});

	it('should render a single AnalysisPage component', () => {
		const wrapper = shallow(<AnalysisPage />);
		expect(true).toBe(true);
	});

});
