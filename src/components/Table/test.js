import Table from './index'
import ReactDOM from "react-dom";
import Enzyme, {shallow} from "enzyme/build";
import renderer from "react-test-renderer";
import React from "react";
import Adapter from "enzyme-adapter-react-16/build";

Enzyme.configure({adapter:new Adapter});


describe('Table', () => {
    const props = {
        list: [
            {title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y'},
            {title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z'},
        ],
    };
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Table onDismiss={()=>{}} sortKey={'AUTHOR'} {...props} />, div);
    });
    it('shows to items in list', ()=> {
        const element =shallow(
            <Table onDismiss={()=>{}} sortKey={'AUTHOR'} {...props}/>
        );
        expect(element.find('.table-row').length).toBe(2);
    });
    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Table onDismiss={()=>{}}  {...props} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('has proper class when column is sorted', ()=>{
        // TODO: figure out how to create this test.
        // The point is ensure that sort key is passed to Sort component
        //     const component =shallow(
        //         <Table onDismiss={()=>{}} sortKey={'AUTHOR'} {...props}/>
        //     );
        //     // const componentInstance = component.instance();
        //     component.setState({sortKey:'AUTHOR'});
        //     component.update();
        //     expect(component.find("button.button-inline.button-active").length).toEqual(1)
    })
});
