import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = "hitsPerPage=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

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

class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
        };
        this.needToSearchTopStories = this.needToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    needToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm]
    }

    setSearchTopStories(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;

        const oldHits = results && results[searchKey] //oldHits are equal (if page ...
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const {searchTerm} = this.state;// equal to searchTerms = this.state.searchTerm
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];
        const isNotId = (item) => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            //    result: Object.assign({},this.state.result,{hits : updatedHits})
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            } // this one create new object and assign for hits property, updated hists list of hits
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this._isMounted && this.setSearchTopStories(result.data))
            .catch(error => this._isMounted && this.setState({error}));
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        if (this.needToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }

    render() {
        const {
            searchTerm,
            results,
            searchKey,
            error
        } = this.state;

        let helloWorld = 'Welcome to the Road to learn React';
        let myName = "Daniel Lipowicz";

        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];


        console.log(this.state);
        if (error){
            return <p>Ough snap something went wrong.
                Call consultant or try again later
            </p>;
        }
        if (!results) {
            return <p>Wait a sec for a results.</p>;
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
                        onSubmit={this.onSearchSubmit}
                    >
                        Another element!!<br/>
                    </Search>
                    {results
                    &&
                    <Table
                        list={list}
                        onDismiss={this.onDismiss}
                    />
                    }
                    <div className='interactions'>
                        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                            More
                        </Button>
                    </div>

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
