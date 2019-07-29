import React, {Component} from 'react';

class Footer extends Component {
    render() {
        return (
            <div className="Footer" align="center">
                <span><i className="fab fa-react"/></span>
                <span> <i className="fab fa-node-js"/></span>
                <span> <a href="https://github.com/DanielLipowicz/HackerNewsReactTutoraial"><i
                    className="fab fa-github"/></a></span>
            </div>
        );
    }
}

export default Footer