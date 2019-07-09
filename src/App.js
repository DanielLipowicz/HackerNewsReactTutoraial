import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
import classnames from 'classnames';
import updateSearchTopStoriesState from './constants/updateSearchTopStoriesState';

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = '100';
export const PATH_BASE = 'http://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = "hitsPerPage=";

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
        this.setState(updateSearchTopStoriesState(hits,page));
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

const ButtonWithLoading = withLoading(Button);

Button.defaultProps = {
    className: '',
};
Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

class Search extends Component {
    componentDidMount() {
        if (this.input) {
            this.input.focus();
        }
    }

    render() {
        const {
            value,
            onChange,
            onSubmit,
            children
        } = this.props;


        return (
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    ref={(node) => {
                        this.input = node;
                    }}
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        )
    }
}

const largeColumn = {
    width: '40%',
};
const midColumn = {
    width: '30%',
};
const smallColumn = {
    width: '10%',
};

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({
                  sortKey,
                  activeSortKey,
                  onSort,
                  isSortRevers,
                  children
              }) => {
    const sortClass = classnames(
        'button-inline',
        {'button-active': sortKey === activeSortKey},
    );
    const iconClass = classnames(
        {"fas fa-sort-amount-up": sortKey === activeSortKey && isSortRevers === false},
        {"fas fa-sort-amount-down-alt": sortKey === activeSortKey && isSortRevers === true}
    );

    return <Button
        onClick={() => onSort(sortKey)}
        className={sortClass}
    >
        {children}
        <i className={iconClass}></i>
    </Button>
        ;
};

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };
        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey) {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({sortKey, isSortReverse})
    }

    render() {
        const {
            list,
            onDismiss,
        } = this.props;

        const {
            sortKey,
            isSortReverse,
        } = this.state;

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;
        return (
            <div className="table">
                <div className='table-header'>
            <span style={{width: '40%'}}>
                <Sort
                    sortKey={'TITLE'}
                    onSort={this.onSort}
                    activeSortKey={sortKey}
                    isSortRevers={isSortReverse}
                >
                    TITLE
                </Sort>
            </span>
                    <span style={{width: '30%'}}>
            <Sort
                sortKey={'AUTHOR'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                isSortRevers={isSortReverse}
            >
                AUTHOR
            </Sort>
            </span>
                    <span style={{width: '10%'}}>
            <Sort
                sortKey={'COMMENTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                isSortRevers={isSortReverse}
            >
                COMMENTS
            </Sort>
            </span>
                    <span style={{width: '10%'}}>
            <Sort
                sortKey={'POINTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                isSortRevers={isSortReverse}
            >
                POINTS
            </Sort>
            </span>
                    <span style={{width: '10%'}}>
                Archive
            </span>

                </div>
                {reverseSortedList.map(item => {
                    return (
                        <div key={item.objectID} className="table-row">
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
                })
                }
            </div>
        )
    }
    ;
}

Table.propTypes = {
    list: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
};


export default App;
export {
    Search,
    Button,
    Table
};

