import ReactDOM from "react-dom";
import {Button} from "./index";
import Enzyme, {shallow} from "enzyme/build";
import renderer from "react-test-renderer";
import React from "react";
import Adapter from "enzyme-adapter-react-16/build";
Enzyme.configure({adapter:new Adapter});

describe('Button', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button onClick={()=>{}}>Give Me More</Button>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    it('button should be single element', ()=>{
        const element = shallow(
            <Button onClick={()=>{}}>Child</Button>
        );
        expect(element.find('button').length).toBe(1);
    });
    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Button onClick={()=>{}}>Give Me More</Button>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});