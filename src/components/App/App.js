import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import Table from './../Table'
import Search from './../Search';
import updateSearchTopStoriesState from './../../constants/updateSearchTopStoriesState';
import {Button} from "./../Buttons";

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = '100';
export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = "hitsPerPage=";

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
            isLoading: false,
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
        this.setState(updateSearchTopStoriesState(hits, page));
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
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            } // this one create new object and assign for hits property, updated hists list of hits
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        this.setState({isLoading: true});
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
            error,
            isLoading,
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

        if (error) {
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
                        <ButtonWithLoading
                            isLoading={isLoading}
                            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                            More
                        </ButtonWithLoading>
                    </div>
                </div>
                <p> The author name is: {myName}</p>
            </div>
        );
    }
}

const withLoading = (Component) => ({isLoading, ...rest}) =>
    isLoading
        ? <Loading/>
        : <Component {...rest} />;

const Loading = ({}) =>
    <div>
        Loading...
    </div>
;

const ButtonWithLoading = withLoading(Button);

export default App;

