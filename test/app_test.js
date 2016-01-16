import { shallow } from 'enzyme';
import React from 'react'
import {expect} from 'chai'
import sinon from 'sinon';
import App from '../app.js'
describe('<App />', () => {
  it('renders correctly', () => {
    let spyRender = sinon.spy(App.prototype, 'render');
    const wrapper = shallow(<App />)
    expect(spyRender.calledOnce).to.be.true
  })
});