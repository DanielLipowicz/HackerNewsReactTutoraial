import ReactDOM from "react-dom";
import Search from "../App/App";
import renderer from "react-test-renderer";
import React from "react";
import Enzyme from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
Enzyme.configure({adapter:new Adapter});

describe('Search', () => {
    it('renders whithout crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search>Search</Search>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    test('has a valid snapshot', () => {
        const component = renderer.create(<Search>Search</Search>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })
});