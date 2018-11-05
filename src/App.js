import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    }

];

function setState(state) {
    this.state = {
        list: state,
    }
}

function isSearched(searchTerm) {
    return function searched(item) {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: null,
            list: list,
            searchTerm: DEFAULT_QUERY,
        };
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    setSearchTopStories(result) {
        this.setState({result});
    }

    componentDidMount() {
        const {searchTerm} = this.state;// equal to searchTerms = this.state.searchTerm
        this.fetchSearchTopStories(searchTerm);
    }

    onDismiss(id) {
        const isNotId = (item) => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            //    result: Object.assign({},this.state.result,{hits : updatedHits})
            result: {...this.state.result, hits: updatedHits} // this one create new object and assin for hits property, updated hists list of hits
        });
    }

    fetchSearchTopStories(searchTerm){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});

    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    render() {
        const {searchTerm, result} = this.state;
        let helloWorld = 'Welcome to the Road to learn React';
        let myName = "Daniel Lipowicz";

        console.log(this.state);
        if (!result) {
            return null;
        }
        return (
            <div className="page">
                <h2>
                    {helloWorld}
                </h2>
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit = {this.onSearchSubmit}
                    >
                        Another element!!<br/>
                    </Search>
                    {
                        result &&
                            <Table
                                list={result.hits}
                                pattern={searchTerm}
                                onDismiss={this.onDismiss}
                            />
                    }


                </div>


                <p> The author name is: {myName}</p>
            </div>
        );
    }
}

const Button = ({
                    onClick,
                    className = '',
                    children
                }) =>
    <button
        onClick={onClick}
        className={className}
        type="button"
    >
        {children}
    </button>;

const Search = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
        <input
            type="text"
            value={value}
            onChange={onChange}
        />
        <button type="submit">
            {children}
        </button>
    </form>;


const largeColumn = {
    width: '40%',
};
const midColumn = {
    width: '30%',
};
const smallColumn = {
    width: '10%',
};

const Table = ({list, onDismiss}) =>
    <div className="table">
        {list.map((item) => {
            return (
                <div id={item.objectID} className="table-row">
                    <span style={largeColumn}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={midColumn}>
                        {item.author}
                        </span>
                    <span style={smallColumn}>
                        {item.num_comments}
                        </span>
                    <span style={smallColumn}>
                        {item.points}
                        </span>
                    <span style={smallColumn}>
                        <Button
                            onClick={() => onDismiss(item.objectID)}
                            className="button-inline"
                        >
                        Dismiss
                        </Button>
                    </span>
                </div>
            );
        })}
    </div>;

export default App;
